<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Harvest;
use App\Repositories\Contracts\HarvestRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentHarvestRepository extends BaseEloquentRepository implements HarvestRepositoryInterface
{
    public function __construct(Harvest $model)
    {
        parent::__construct($model);
    }

    public function harvestsForFarmer(int $userId): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->orderByDesc('harvest_date')
                ->get();
    }
}
