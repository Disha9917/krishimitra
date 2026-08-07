<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\DistrictCropMap;
use App\Repositories\Contracts\DistrictCropMapRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentDistrictCropMapRepository extends BaseEloquentRepository implements DistrictCropMapRepositoryInterface
{
    public function __construct(DistrictCropMap $model)
    {
        parent::__construct($model);
    }

    public function cropsForDistrict(int $districtId): Collection
    {
            return $this->model
                ->where('district_id', $districtId)
                ->with('crop')
                ->get();
    }
}
