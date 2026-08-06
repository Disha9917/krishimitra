<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Village;
use App\Repositories\Contracts\VillageRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentVillageRepository extends BaseEloquentRepository implements VillageRepositoryInterface
{
    public function __construct(Village $model)
    {
        parent::__construct($model);
    }

    public function villagesForTaluka(int $talukaId): Collection
    {
            return $this->model
                ->where('taluka_id', $talukaId)
                ->orderBy('name')
                ->get();
    }
}
