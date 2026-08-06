<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\WeatherForecast;
use App\Repositories\Contracts\WeatherForecastRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentWeatherForecastRepository extends BaseEloquentRepository implements WeatherForecastRepositoryInterface
{
    public function __construct(WeatherForecast $model)
    {
        parent::__construct($model);
    }

    public function getForecast(string $locationKey, ?string $date = null): ?WeatherForecast
    {
            return $this->model
                ->where('location_key', $locationKey)
                ->where('forecast_date', $date ?? today()->toDateString())
                ->first();
    }

    public function getWeatherHistory(string $locationKey, int $days = 7): Collection
    {
            return $this->model
                ->where('location_key', $locationKey)
                ->where('forecast_date', '>=', today()->subDays($days - 1)->toDateString())
                ->orderBy('forecast_date')
                ->get();
    }
}
