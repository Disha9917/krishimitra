<?php

declare(strict_types=1);

namespace App\Services\Weather;

use App\Models\WeatherAlert;
use App\Models\WeatherCache;
use App\Models\WeatherForecast;
use App\Services\Common\DTO\WeatherSnapshotDTO;
use Illuminate\Database\Eloquent\Collection;

interface WeatherServiceInterface
{
    /**
     * Latest observed conditions for a location.
     */
    public function getCurrentWeather(string $locationKey): ?WeatherSnapshotDTO;

    /**
     * Forecast for a location on an optional date (defaults to today).
     */
    public function getForecast(string $locationKey, ?string $date = null): ?WeatherForecast;

    public function getWeatherHistory(string $locationKey, int $days = 7): Collection;

    /**
     * Upsert the latest observed conditions cache for a location.
     */
    public function refreshCache(array $payload): WeatherCache;

    /**
     * Evaluate the upcoming forecast against risk thresholds and persist
     * non-duplicate weather alerts for a district.
     *
     * @return int number of alerts created
     */
    public function generateWeatherAlerts(int $districtId, string $locationKey, int $issuedByUserId): int;

    public function activeAlerts(): Collection;

    public function alertsForDistrict(int $districtId): Collection;
}
