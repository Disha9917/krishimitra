<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\WeatherCache;
use App\Repositories\Contracts\WeatherCacheRepositoryInterface;

class EloquentWeatherCacheRepository extends BaseEloquentRepository implements WeatherCacheRepositoryInterface
{
    public function __construct(WeatherCache $model)
    {
        parent::__construct($model);
    }

    public function getCachedWeather(string $locationKey): ?WeatherCache
    {
            return $this->model
                ->where('location_key', $locationKey)
                ->orderByDesc('observed_at')
                ->first();
    }
}
