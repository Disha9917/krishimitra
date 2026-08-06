<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\WeatherHourlyForecast;
use App\Repositories\Contracts\WeatherHourlyForecastRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentWeatherHourlyForecastRepository extends BaseEloquentRepository implements WeatherHourlyForecastRepositoryInterface
{
    public function __construct(WeatherHourlyForecast $model)
    {
        parent::__construct($model);
    }

    public function getHourlyForecasts(string $locationKey, int $hours): Collection
    {
        return $this->model
            ->where('location_key', $locationKey)
            ->where('forecast_time', '>=', now()->startOfHour())
            ->where('forecast_time', '<', now()->startOfHour()->addHours($hours))
            ->orderBy('forecast_time')
            ->get();
    }
}
