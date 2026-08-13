<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\Jobs\GenerateReportJob;
use App\Models\ExportHistory;
use App\Models\Report;
use App\Repositories\Contracts\ExportHistoryRepositoryInterface;
use App\Repositories\Contracts\ReportRepositoryInterface;
use DomainException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;
use Throwable;

class ReportService implements ReportServiceInterface
{
    public function __construct(
        private readonly ReportRepositoryInterface $reports,
        private readonly ExportHistoryRepositoryInterface $exports,
        private readonly ReportDataBuilder $builder,
        private readonly ReportFormatter $formatter,
    ) {
    }

    public function generateReport(int $userId, string $title, string $category, array $summary): Report
    {
        return $this->reports->create([
            'user_id' => $userId,
            'title' => $title,
            'category' => $category,
            'file_format' => 'PDF',
            'file_size_bytes' => null,
            'file_size_display' => null,
            'summary_text' => json_encode($summary, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
            'storage_path' => null,
            'source_ref' => null,
            'generated_at' => now(),
        ]);
    }

    public function reportsForUser(int $userId): Collection
    {
        return $this->reports->reportsForUser($userId);
    }

    public function recordExport(
        int $userId,
        int $reportId,
        string $exportType,
        string $format,
        ?int $rowCount = null,
        ?string $ipAddress = null,
    ): ExportHistory {
        return $this->exports->create([
            'user_id' => $userId,
            'report_id' => $reportId,
            'export_type' => $exportType,
            'format' => $format,
            'row_count' => $rowCount,
            'ip_address' => $ipAddress,
            'exported_at' => now(),
        ]);
    }

    public function exportHistory(int $userId): Collection
    {
        return $this->exports->historyForUser($userId);
    }

    public function findReport(int $userId, int $reportId): ?Report
    {
        $report = $this->reports->findById($reportId);

        if ($report === null || (int) $report->user_id !== $userId) {
            return null;
        }

        return $report;
    }

    public function reportTypes(): array
    {
        return config('report.types');
    }

    public function generate(int $userId, string $reportType, array $filters, string $format): Report
    {
        $this->assertTypeSupported($reportType);
        $formats = $this->normalizeFormats($format);

        $report = $this->reports->create([
            'user_id' => $userId,
            'title' => $this->titleFor($reportType, $filters),
            'category' => (string) config('report.types.'.$reportType),
            'report_type' => $reportType,
            'status' => 'generating',
            'formats' => $formats,
            'filters' => $filters,
            'file_format' => count($formats) === 2 ? 'BOTH' : strtoupper($formats[0]),
            'file_size_bytes' => null,
            'file_size_display' => null,
            'storage_path' => null,
            'generated_at' => now(),
        ]);

        GenerateReportJob::dispatch((int) $report->id);

        $report->refresh();

        return $report;
    }

    public function finalizeReport(int $reportId): void
    {
        $report = $this->reports->findById($reportId);

        if ($report === null || $report->status === 'ready') {
            return;
        }

        $userId = (int) $report->user_id;

        try {
            $data = $this->builder->build((string) $report->report_type, $userId, (array) $report->filters);
            $files = [];
            $totalBytes = 0;

            foreach ((array) $report->formats as $format) {
                $content = match ($format) {
                    'csv' => $this->formatter->csv((string) $report->title, $data),
                    'pdf' => $this->formatter->pdf((string) $report->title, $data),
                    default => throw new DomainException(sprintf('Format [%s] is not supported.', $format)),
                };

                $path = sprintf('%s/%d/%s.%s', config('report.path_prefix'), $userId, $report->uuid, $format);

                Storage::disk((string) config('report.disk'))->put($path, $content);

                $files[] = [
                    'format' => $format,
                    'path' => $path,
                    'size_bytes' => strlen($content),
                ];

                $totalBytes += strlen($content);
            }

            $this->reports->update($reportId, [
                'status' => 'ready',
                'data' => $data,
                'files' => $files,
                'storage_path' => $files[0]['path'] ?? null,
                'file_size_bytes' => $totalBytes,
                'file_size_display' => $this->humanBytes($totalBytes),
                'generated_at' => now(),
            ]);
        } catch (Throwable $exception) {
            $this->reports->update($reportId, [
                'status' => 'failed',
                'error_message' => $exception->getMessage(),
            ]);
        }
    }

    public function previewReport(int $userId, int $reportId): ?Report
    {
        return $this->reports->findOwned($userId, $reportId);
    }

    public function history(int $userId, ?string $reportType = null, int $limit = 50): Collection
    {
        return $this->reports->reportsForUserByType($userId, $reportType, $limit);
    }

    public function recentReports(int $userId, int $limit = 10): Collection
    {
        return $this->reports->recentReports($userId, $limit);
    }

    public function favoriteReports(int $userId): Collection
    {
        return $this->reports->favoritesForUser($userId);
    }

    public function toggleFavorite(int $userId, int $reportId): ?Report
    {
        $report = $this->reports->findOwned($userId, $reportId);

        if ($report === null) {
            return null;
        }

        return $this->reports->setFavorite($reportId, !(bool) $report->is_favorite);
    }

    public function removeReport(int $userId, int $reportId): bool
    {
        $report = $this->reports->findOwned($userId, $reportId);

        if ($report === null) {
            return false;
        }

        return $this->reports->delete($reportId);
    }

    public function download(int $userId, int $reportId, string $format, ?string $ipAddress = null): ?array
    {
        $report = $this->reports->findOwned($userId, $reportId);

        if ($report === null) {
            return null;
        }

        if ($report->status !== 'ready') {
            throw new DomainException(
                $report->status === 'failed'
                    ? 'The report failed to generate and cannot be downloaded.'
                    : 'The report is still being generated.',
            );
        }

        $files = (array) $report->files;
        $target = null;

        foreach ($files as $file) {
            if (($file['format'] ?? null) === $format) {
                $target = $file;

                break;
            }
        }

        if ($target === null) {
            throw new DomainException(sprintf('This report was not generated in %s format.', strtoupper($format)));
        }

        $this->recordExport(
            $userId,
            $reportId,
            (string) $report->report_type,
            strtoupper($format),
            $this->rowCount($report),
            $ipAddress,
        );

        return [
            'disk' => (string) config('report.disk'),
            'path' => (string) $target['path'],
            'filename' => sprintf('%s.%s', $report->uuid, $format),
            'row_count' => $this->rowCount($report),
        ];
    }

    private function assertTypeSupported(string $reportType): void
    {
        if (!array_key_exists($reportType, config('report.types'))) {
            throw new DomainException(sprintf('Report type [%s] is not supported.', $reportType));
        }
    }

    /**
     * @return list<string>
     */
    private function normalizeFormats(string $format): array
    {
        return match ($format) {
            'csv', 'pdf' => [$format],
            'both' => ['csv', 'pdf'],
            default => throw new DomainException(sprintf('Format [%s] is not supported.', $format)),
        };
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function titleFor(string $reportType, array $filters): string
    {
        $label = (string) config('report.types.'.$reportType);
        $dateRange = null;

        if (isset($filters['from']) && isset($filters['to'])) {
            $dateRange = sprintf(' (%s to %s)', $filters['from'], $filters['to']);
        }

        return $label.' Report'.$dateRange;
    }

    private function rowCount(Report $report): int
    {
        $data = (array) $report->data;

        return count($data);
    }

    private function humanBytes(int $bytes): string
    {
        if ($bytes < 1024) {
            return $bytes.' B';
        }

        if ($bytes < 1024 * 1024) {
            return round($bytes / 1024, 1).' KB';
        }

        return round($bytes / (1024 * 1024), 1).' MB';
    }
}
