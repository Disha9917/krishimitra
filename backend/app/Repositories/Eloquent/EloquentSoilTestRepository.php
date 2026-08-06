<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\SoilTest;
use App\Repositories\Contracts\SoilTestRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentSoilTestRepository extends BaseEloquentRepository implements SoilTestRepositoryInterface
{
    public function __construct(SoilTest $model)
    {
        parent::__construct($model);
    }

    public function latestForFarmer(int $userId, int $limit = 5): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->orderByDesc('report_date')
                ->limit($limit)
                ->get();
    }
}
