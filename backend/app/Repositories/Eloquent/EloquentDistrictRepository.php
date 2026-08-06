<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\District;
use App\Repositories\Contracts\DistrictRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentDistrictRepository extends BaseEloquentRepository implements DistrictRepositoryInterface
{
    public function __construct(District $model)
    {
        parent::__construct($model);
    }

    public function districtsForRegion(int $regionId): Collection
    {
            return $this->model
                ->where('region_id', $regionId)
                ->orderBy('name')
                ->get();
    }

    public function activeDistricts(): Collection
    {
            return $this->model
                ->where('is_active', true)
                ->orderBy('name')
                ->get();
    }
}
