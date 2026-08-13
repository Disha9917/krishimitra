<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\ImportHistory;
use App\Repositories\Contracts\ImportHistoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentImportHistoryRepository extends BaseEloquentRepository implements ImportHistoryRepositoryInterface
{
    public function __construct(ImportHistory $model)
    {
        parent::__construct($model);
    }

    /**
     * @return Collection<int, ImportHistory>
     */
    public function historyForDataset(?string $datasetType = null, ?string $status = null, int $limit = 50): Collection
    {
        $query = $this->model->orderByDesc('created_at');

        if ($datasetType !== null) {
            $query->where('dataset_type', $datasetType);
        }

        if ($status !== null) {
            $query->where('status', $status);
        }

        return $query->limit($limit)->get();
    }

    public function markStatus(int $id, string $status, array $extra = []): ?ImportHistory
    {
        $record = $this->model->find($id);

        if ($record === null) {
            return null;
        }

        $record->update(array_merge(['status' => $status], $extra));

        return $record;
    }

    public function updateCounts(int $id, int $inserted, int $updated, int $skipped, int $failed): ?ImportHistory
    {
        $record = $this->model->find($id);

        if ($record === null) {
            return null;
        }

        $record->increment('imported_rows', $inserted);
        $record->increment('updated_rows', $updated);
        $record->increment('skipped_rows', $skipped);
        $record->increment('failed_rows', $failed);

        return $record->refresh();
    }
}
