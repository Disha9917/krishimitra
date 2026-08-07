<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Region;
use App\Repositories\Contracts\RegionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentRegionRepository extends BaseEloquentRepository implements RegionRepositoryInterface
{
    public function __construct(Region $model)
    {
        parent::__construct($model);
    }

    public function activeRegions(): Collection
    {
            return $this->model
                ->where('is_active', true)
                ->orderBy('display_order')
                ->get();
    }
}
