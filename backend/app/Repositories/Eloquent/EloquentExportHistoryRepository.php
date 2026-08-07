<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\ExportHistory;
use App\Repositories\Contracts\ExportHistoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentExportHistoryRepository extends BaseEloquentRepository implements ExportHistoryRepositoryInterface
{
    public function __construct(ExportHistory $model)
    {
        parent::__construct($model);
    }

    public function historyForUser(int $userId): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->orderByDesc('id')
                ->get();
    }
}
