<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\WeatherStation;
use Illuminate\Database\Eloquent\Collection;

interface WeatherStationRepositoryInterface extends BaseRepositoryInterface
{

    public function stationsForDistrict(int $districtId): Collection;
}
