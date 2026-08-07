<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\DashboardAnalytic;
use App\Repositories\Contracts\DashboardAnalyticRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentDashboardAnalyticRepository extends BaseEloquentRepository implements DashboardAnalyticRepositoryInterface
{
    public function __construct(DashboardAnalytic $model)
    {
        parent::__construct($model);
    }

    public function analyticsForUser(int $userId): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->orderByDesc('id')
                ->get();
    }
}
