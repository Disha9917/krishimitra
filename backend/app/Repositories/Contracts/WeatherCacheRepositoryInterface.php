<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\WeatherCache;

interface WeatherCacheRepositoryInterface extends BaseRepositoryInterface
{

    public function getCachedWeather(string $locationKey): ?WeatherCache;
}
