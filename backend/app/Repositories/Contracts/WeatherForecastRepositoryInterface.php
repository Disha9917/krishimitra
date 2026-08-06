<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\WeatherForecast;
use Illuminate\Database\Eloquent\Collection;

interface WeatherForecastRepositoryInterface extends BaseRepositoryInterface
{

    public function getForecast(string $locationKey, ?string $date = null): ?WeatherForecast;

    public function getWeatherHistory(string $locationKey, int $days = 7): Collection;
}
