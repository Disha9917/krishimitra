<?php

declare(strict_types=1);

namespace App\Services\Weather;

use App\Models\Notification;
use App\Models\WeatherForecast;
use App\Services\Common\DTO\WeatherSnapshotDTO;
use Illuminate\Database\Eloquent\Collection;

interface WeatherServiceInterface
{
    /**
     * Canonical location key for a coordinate pair.
     */
    public function locationKey(float $lat, float $lng): string;

    /**
     * Latest observed conditions for a location (DB-backed snapshot).
     */
    public function getCurrentWeather(string $locationKey): ?WeatherSnapshotDTO;

    /**
     * Forecast for a location on an optional date (defaults to today).
     */
    public function getForecast(string $locationKey, ?string $date = null): ?WeatherForecast;

    public function getWeatherHistory(string $locationKey, int $days = 7): Collection;

    /**
     * Current conditions with cache-first flow.
     *
     * @return array<string, mixed> {locationKey, source, data...}
     */
    public function currentWeather(float $lat, float $lng, bool $force = false): array;

    /**
     * Daily forecast with cache-first flow.
     *
     * @return array<string, mixed> {locationKey, source, days: list}
     */
    public function dailyForecast(float $lat, float $lng, int $days = 7, bool $force = false): array;

    /**
     * Hourly forecast with cache-first flow.
     *
     * @return array<string, mixed> {locationKey, source, hours: list}
     */
    public function hourlyForecast(float $lat, float $lng, int $hours = 24, bool $force = false): array;

    /**
     * Past daily observations (fetched from the provider on first request).
     *
     * @return array<string, mixed> {locationKey, source, days: list}
     */
    public function weatherHistory(float $lat, float $lng, int $days = 7): array;

    /**
     * Cache validity for current, daily, and hourly datasets.
     *
     * @return array<string, mixed>
     */
    public function cacheStatus(float $lat, float $lng): array;

    /**
     * Force-refresh current, daily, and hourly data from the provider.
     *
     * @return array<string, mixed>
     */
    public function refreshWeatherCache(float $lat, float $lng): array;

    /**
     * Active weather alerts, optionally scoped to a district.
     */
    public function activeWeatherAlerts(?int $districtId = null): Collection;

    /**
     * Evaluate the upcoming forecast against risk thresholds and persist
     * non-duplicate weather alerts for a district.
     *
     * @return int number of alerts created
     */
    public function generateWeatherAlerts(int $districtId, string $locationKey, int $issuedByUserId): int;

    public function activeAlerts(): Collection;

    public function alertsForDistrict(int $districtId): Collection;

    /**
     * Rain probability outlook for the next N days.
     *
     * @return array<string, mixed>
     */
    public function rainPrediction(float $lat, float $lng, int $days = 7): array;

    /**
     * Temperature trend across the forecast window.
     *
     * @return array<string, mixed>
     */
    public function temperatureTrend(float $lat, float $lng, int $days = 7): array;

    /**
     * Humidity trend across the forecast window.
     *
     * @return array<string, mixed>
     */
    public function humidityTrend(float $lat, float $lng, int $days = 7): array;

    /**
     * Current and forecast wind summary.
     *
     * @return array<string, mixed>
     */
    public function windSummary(float $lat, float $lng): array;

    /**
     * UV index summary (current, peak, category, advisory).
     *
     * @return array<string, mixed>
     */
    public function uvSummary(float $lat, float $lng): array;

    /**
     * Sunrise/sunset for the current day.
     *
     * @return array<string, mixed>
     */
    public function sunTimes(float $lat, float $lng): array;

    /**
     * Human-readable weather summary.
     *
     * @return array<string, mixed>
     */
    public function weatherSummary(float $lat, float $lng): array;

    /**
     * Farmer weather dashboard: current conditions, today's forecast, alerts, summary.
     *
     * @return array<string, mixed>
     */
    public function farmerWeatherDashboard(int $userId, float $lat, float $lng, ?int $districtId = null): array;

    /**
     * Generate severe-weather notifications for a farmer from active district alerts.
     *
     * @return array{created: int, notifications: Collection<int, Notification>}
     */
    public function severeWeatherNotifications(int $userId, ?int $districtId): array;

    /**
     * Weather notifications for a farmer.
     *
     * @return Collection<int, Notification>
     */
    public function listWeatherNotifications(int $userId): Collection;
}
