<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\Models\ExportHistory;
use App\Models\Report;
use App\Repositories\Contracts\ExportHistoryRepositoryInterface;
use App\Repositories\Contracts\ReportRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ReportService implements ReportServiceInterface
{
    public function __construct(
        private readonly ReportRepositoryInterface $reports,
        private readonly ExportHistoryRepositoryInterface $exports,
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
}
