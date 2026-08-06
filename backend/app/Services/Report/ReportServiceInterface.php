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
}
