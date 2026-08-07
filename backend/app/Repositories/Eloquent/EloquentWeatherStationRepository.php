<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\WeatherStation;
use App\Repositories\Contracts\WeatherStationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentWeatherStationRepository extends BaseEloquentRepository implements WeatherStationRepositoryInterface
{
    public function __construct(WeatherStation $model)
    {
        parent::__construct($model);
    }

    public function stationsForDistrict(int $districtId): Collection
    {
            return $this->model
                ->where('district_id', $districtId)
                ->orderBy('name')
                ->get();
    }
}
