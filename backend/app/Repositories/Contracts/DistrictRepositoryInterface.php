<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\District;
use Illuminate\Database\Eloquent\Collection;

interface DistrictRepositoryInterface extends BaseRepositoryInterface
{

    public function districtsForRegion(int $regionId): Collection;

    public function activeDistricts(): Collection;
}
