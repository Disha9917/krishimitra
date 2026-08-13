<?php

declare(strict_types=1);

namespace App\Services\Import;

use App\Models\ImportHistory;
use App\Models\ImportLog;
use App\Repositories\Contracts\ImportHistoryRepositoryInterface;
use App\Repositories\Contracts\ImportLogRepositoryInterface;
use App\Services\Import\Contracts\ImportHistoryServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class ImportHistoryService implements ImportHistoryServiceInterface
{
    public function __construct(
        private readonly ImportHistoryRepositoryInterface $history,
        private readonly ImportLogRepositoryInterface $logs,
    ) {}

    public function create(int $userId, string $datasetType, string $fileName, string $filePath, array $report): ImportHistory
    {
        return $this->history->create([
            'dataset_type' => $datasetType,
            'file_name' => $fileName,
            'file_path' => $filePath,
            'uploaded_by' => $userId,
            'status' => 'pending',
            'total_rows' => $report['total_rows'],
            'valid_rows' => $report['valid_rows'],
            'duplicate_rows' => $report['duplicate_rows'],
            'existing_rows' => $report['existing_rows'],
            'error_rows' => $report['error_rows'],
        ]);
    }

    public function markQueued(int $id): void
    {
        $this->history->markStatus($id, 'queued');
    }

    public function markProcessing(int $id, Carbon $startedAt): void
    {
        $this->history->markStatus($id, 'processing', ['started_at' => $startedAt]);
    }

    public function updateProgress(int $id, int $inserted, int $updated, int $skipped, int $failed): void
    {
        $this->history->updateCounts($id, $inserted, $updated, $skipped, $failed);
    }

    public function complete(int $id, int $failedRows, int $durationMs): void
    {
        $this->history->markStatus($id, $failedRows > 0 ? 'partial' : 'imported', [
            'finished_at' => now(),
            'duration_ms' => $durationMs,
        ]);
    }

    public function fail(int $id, string $message): void
    {
        $this->history->markStatus($id, 'failed', [
            'error_message' => $message,
            'finished_at' => now(),
        ]);
    }

    public function markRolledBack(int $id): void
    {
        $this->history->markStatus($id, 'rolled_back', [
            'finished_at' => now(),
        ]);
    }

    /**
     * @return Collection<int, ImportHistory>
     */
    public function list(?string $datasetType = null, ?string $status = null, int $limit = 50): Collection
    {
        return $this->history->historyForDataset($datasetType, $status, $limit);
    }

    public function find(int $id): ?ImportHistory
    {
        /** @var ImportHistory|null */
        return $this->history->findById($id);
    }

    /**
     * @return Collection<int, ImportLog>
     */
    public function logs(int $importId): Collection
    {
        return $this->logs->logsForImport($importId);
    }

    /**
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
    ): void {
        $this->logs->create([
            'import_id' => $importId,
            'row_number' => $rowNumber,
            'action' => $action,
            'entity_id' => $entityId,
            'entity_key' => $entityKey,
            'message' => $message,
            'before_data' => $beforeData === [] ? null : $beforeData,
        ]);
    }
}
