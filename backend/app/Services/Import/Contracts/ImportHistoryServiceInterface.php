<?php

declare(strict_types=1);

namespace App\Services\Import\Contracts;

use App\Models\ImportHistory;
use App\Models\ImportLog;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

interface ImportHistoryServiceInterface
{
    public function create(int $userId, string $datasetType, string $fileName, string $filePath, array $report): ImportHistory;

    public function markQueued(int $id): void;

    public function markProcessing(int $id, Carbon $startedAt): void;

    /**
     * Accumulate per-action row counts while an import processes.
     */
    public function updateProgress(int $id, int $inserted, int $updated, int $skipped, int $failed): void;

    public function complete(int $id, int $failedRows, int $durationMs): void;

    public function fail(int $id, string $message): void;

    public function markRolledBack(int $id): void;

    /**
     * @return Collection<int, ImportHistory>
     */
    public function list(?string $datasetType = null, ?string $status = null, int $limit = 50): Collection;

    public function find(int $id): ?ImportHistory;

    /**
     * @return Collection<int, ImportLog>
     */
    public function logs(int $importId): Collection;

    /**
     * Record a single row-level outcome.
     *
     * @param  array<string, mixed>  $beforeData
     */
    public function logRow(
        int $importId,
        int $rowNumber,
        string $action,
        ?int $entityId,
        ?string $entityKey,
        string $message,
        array $beforeData = [],
    ): void;
}
