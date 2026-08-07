<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface WeatherHourlyForecastRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Hourly rows for a location within the next N hours, oldest first.
     */
    public function getHourlyForecasts(string $locationKey, int $hours): Collection;
}
