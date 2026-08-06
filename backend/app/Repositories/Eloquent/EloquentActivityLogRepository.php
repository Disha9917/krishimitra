<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\ActivityLog;
use App\Repositories\Contracts\ActivityLogRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentActivityLogRepository extends BaseEloquentRepository implements ActivityLogRepositoryInterface
{
    public function __construct(ActivityLog $model)
    {
        parent::__construct($model);
    }

    public function recent(int $limit = 50): Collection
    {
            return $this->model
                ->orderByDesc('performed_at')
                ->limit($limit)
                ->get();
    }

    public function logsForUser(int $userId, int $limit = 50): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->orderByDesc('performed_at')
                ->limit($limit)
                ->get();
    }
}
