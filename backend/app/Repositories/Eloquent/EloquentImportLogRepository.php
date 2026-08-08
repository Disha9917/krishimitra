<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\ImportLog;
use App\Repositories\Contracts\ImportLogRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentImportLogRepository extends BaseEloquentRepository implements ImportLogRepositoryInterface
{
    public function __construct(ImportLog $model)
    {
        parent::__construct($model);
    }

    /**
     * @return Collection<int, ImportLog>
     */
    public function logsForImport(int $importId): Collection
    {
        return $this->model
            ->where('import_id', $importId)
            ->orderBy('row_number')
            ->get();
    }

    /**
     * @param  list<string>  $actions
     * @return Collection<int, ImportLog>
     */
    public function logsForImportByAction(int $importId, array $actions): Collection
    {
        return $this->model
            ->where('import_id', $importId)
            ->whereIn('action', $actions)
            ->get();
    }
}
