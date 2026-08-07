<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\DistrictCropMap;
use Illuminate\Database\Eloquent\Collection;

interface DistrictCropMapRepositoryInterface extends BaseRepositoryInterface
{

    public function cropsForDistrict(int $districtId): Collection;
}
