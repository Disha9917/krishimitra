<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\Models\ExportHistory;
use App\Models\Report;
use Illuminate\Database\Eloquent\Collection;

interface ReportServiceInterface
{
    /**
     * Persist a generated report with its summary payload.
     */
    public function generateReport(int $userId, string $title, string $category, array $summary): Report;

    public function reportsForUser(int $userId): Collection;

    /**
     * Record an export action against a report.
     */
    public function recordExport(
        int $userId,
        int $reportId,
        string $exportType,
        string $format,
        ?int $rowCount = null,
        ?string $ipAddress = null,
    ): ExportHistory;

    public function exportHistory(int $userId): Collection;

    public function findReport(int $userId, int $reportId): ?Report;

    /**
     * The supported report type keys.
     *
     * @return array<string, string>
     */
    public function reportTypes(): array;

    /**
     * Create a report record (status generating) and dispatch the generation job.
     *
     * @param  array<string, mixed>  $filters
     * @throws \DomainException when the type or format is unsupported
     */
    public function generate(int $userId, string $reportType, array $filters, string $format): Report;

    /**
     * Build the data snapshot, write the export files and mark the report ready.
     */
    public function finalizeReport(int $reportId): void;

    /**
     * A report owned by the user (with its data snapshot for preview), or null.
     */
    public function previewReport(int $userId, int $reportId): ?Report;

    /**
     * Report history for a user, newest first, optionally filtered by type.
     */
    public function history(int $userId, ?string $reportType = null, int $limit = 50): Collection;

    /**
     * Most recently generated reports of a user.
     */
    public function recentReports(int $userId, int $limit = 10): Collection;

    /**
     * Favorite reports of a user.
     */
    public function favoriteReports(int $userId): Collection;

    /**
     * Toggle the favorite flag of a user's report.
     */
    public function toggleFavorite(int $userId, int $reportId): ?Report;

    /**
     * Soft delete a user's report.
     */
    public function removeReport(int $userId, int $reportId): bool;

    /**
     * Resolve the stored file for download (records the export action).
     *
     * @return array{disk: string, path: string, filename: string, row_count: int}|null
     * @throws \DomainException when the report is not ready, lacks the format, or is not owned
     */
    public function download(int $userId, int $reportId, string $format, ?string $ipAddress = null): ?array;
}
