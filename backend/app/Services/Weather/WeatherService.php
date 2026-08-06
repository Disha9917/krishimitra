<?php

declare(strict_types=1);

namespace App\Services\Weather;

use App\Models\WeatherAlert;
use App\Models\WeatherCache;
use App\Models\WeatherForecast;
use App\Models\WeatherHourlyForecast;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use App\Repositories\Contracts\WeatherAlertRepositoryInterface;
use App\Repositories\Contracts\WeatherCacheRepositoryInterface;
use App\Repositories\Contracts\WeatherForecastRepositoryInterface;
use App\Repositories\Contracts\WeatherHourlyForecastRepositoryInterface;
use App\Services\Common\DTO\WeatherSnapshotDTO;
use App\Services\Weather\Exceptions\WeatherProviderException;
use App\Services\Weather\Providers\WeatherProviderInterface;
use DomainException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class WeatherService implements WeatherServiceInterface
{
    private const CURRENT_TTL_SECONDS = 1800;

    private const FORECAST_TTL_SECONDS = 21600;

    private const HOURLY_TTL_SECONDS = 3600;

    private const HISTORY_TTL_SECONDS = 86400;

    private const HEAVY_RAIN_THRESHOLD_PCT = 70;

    private const HEATWAVE_THRESHOLD_C = 45;

    private const COLD_WAVE_THRESHOLD_C = 5;

    private const HIGH_WIND_THRESHOLD_KMH = 40;

    public function __construct(
        private readonly WeatherProviderInterface $provider,
        private readonly WeatherCacheRepositoryInterface $weatherCache,
        private readonly WeatherForecastRepositoryInterface $forecasts,
        private readonly WeatherHourlyForecastRepositoryInterface $hourlyForecasts,
        private readonly WeatherAlertRepositoryInterface $alerts,
        private readonly NotificationRepositoryInterface $notifications,
    ) {}

    public function locationKey(float $lat, float $lng): string
    {
        return $this->locationKeyFor($lat, $lng);
    }

    public function getCurrentWeather(string $locationKey): ?WeatherSnapshotDTO
    {
        $cache = $this->weatherCache->getCachedWeather($locationKey);

        return $cache !== null ? WeatherSnapshotDTO::fromModel($cache) : null;
    }

    public function getForecast(string $locationKey, ?string $date = null): ?WeatherForecast
    {
        return $this->forecasts->getForecast($locationKey, $date);
    }

    public function getWeatherHistory(string $locationKey, int $days = 7): Collection
    {
        return $this->forecasts->getWeatherHistory($locationKey, $days);
    }

    public function currentWeather(float $lat, float $lng, bool $force = false): array
    {
        $locationKey = $this->locationKey($lat, $lng);
        $cached = $this->weatherCache->getCachedWeather($locationKey);

        if (! $force && $cached !== null && $this->isFresh($cached->observed_at, self::CURRENT_TTL_SECONDS)) {
            return $this->currentPayload($cached, 'cache');
        }

        try {
            $payload = $this->provider->fetchCurrent($lat, $lng);
            $row = $this->upsertCache($locationKey, $payload);

            return $this->currentPayload($row, 'provider');
        } catch (WeatherProviderException $e) {
            if ($cached !== null) {
                return $this->currentPayload($cached, 'stale');
            }

            throw $e;
        }
    }

    public function dailyForecast(float $lat, float $lng, int $days = 7, bool $force = false): array
    {
        $locationKey = $this->locationKey($lat, $lng);
        $rows = $this->dailyRows($locationKey, $days);

        if (! $force && $this->dailyIsFresh($rows, $days)) {
            return $this->dailyPayload($locationKey, $rows, 'cache');
        }

        try {
            $fetched = $this->provider->fetchDaily($lat, $lng, $days);
            $rows = $this->persistDaily($locationKey, $fetched);

            return $this->dailyPayload($locationKey, $rows, 'provider');
        } catch (WeatherProviderException $e) {
            if ($rows->isNotEmpty()) {
                return $this->dailyPayload($locationKey, $rows, 'stale');
            }

            throw $e;
        }
    }

    public function hourlyForecast(float $lat, float $lng, int $hours = 24, bool $force = false): array
    {
        $locationKey = $this->locationKey($lat, $lng);
        $rows = $this->hourlyRows($locationKey, $hours);

        if (! $force && $this->hourlyIsFresh($rows, $hours)) {
            return $this->hourlyPayload($locationKey, $rows, 'cache');
        }

        try {
            $fetched = $this->provider->fetchHourly($lat, $lng, $hours);
            $rows = $this->persistHourly($locationKey, $fetched);

            return $this->hourlyPayload($locationKey, $rows, 'provider');
        } catch (WeatherProviderException $e) {
            if ($rows->isNotEmpty()) {
                return $this->hourlyPayload($locationKey, $rows, 'stale');
            }

            throw $e;
        }
    }

    public function weatherHistory(float $lat, float $lng, int $days = 7): array
    {
        $locationKey = $this->locationKey($lat, $lng);
        $pastDays = max(1, $days - 1);
        $rows = $this->forecasts->forecastsBetween(
            $locationKey,
            today()->subDays($pastDays)->toDateString(),
            today()->toDateString(),
        );

        if ($rows->isNotEmpty() && $this->collectionIsFresh($rows, self::HISTORY_TTL_SECONDS)) {
            return [
                'locationKey' => $locationKey,
                'source' => 'cache',
                'days' => $rows->map(fn (WeatherForecast $f): array => $this->dailyRowPayload($f))->values()->all(),
            ];
        }

        try {
            $fetched = $this->provider->fetchDaily($lat, $lng, 1, $pastDays);
            $rows = $this->persistDaily($locationKey, $fetched);

            return [
                'locationKey' => $locationKey,
                'source' => 'provider',
                'days' => $rows->map(fn (WeatherForecast $f): array => $this->dailyRowPayload($f))->values()->all(),
            ];
        } catch (WeatherProviderException $e) {
            if ($rows->isNotEmpty()) {
                return [
                    'locationKey' => $locationKey,
                    'source' => 'stale',
                    'days' => $rows->map(fn (WeatherForecast $f): array => $this->dailyRowPayload($f))->values()->all(),
                ];
            }

            throw $e;
        }
    }

    public function cacheStatus(float $lat, float $lng): array
    {
        $locationKey = $this->locationKey($lat, $lng);
        $cache = $this->weatherCache->getCachedWeather($locationKey);
        $daily = $this->dailyRows($locationKey, 7);
        $hourly = $this->hourlyRows($locationKey, 24);

        return [
            'locationKey' => $locationKey,
            'current' => [
                'cached' => $cache !== null,
                'valid' => $cache !== null && $this->isFresh($cache->observed_at, self::CURRENT_TTL_SECONDS),
                'ageMinutes' => $cache !== null ? (int) $cache->observed_at->diffInMinutes(now()) : null,
                'cachedAt' => $cache?->observed_at?->toIso8601String(),
                'ttlMinutes' => (int) round(self::CURRENT_TTL_SECONDS / 60),
            ],
            'daily' => [
                'cached' => $daily->isNotEmpty(),
                'valid' => $this->dailyIsFresh($daily, 7),
                'daysCached' => $daily->count(),
                'cachedAt' => $daily->max('updated_at')?->toIso8601String(),
                'ttlHours' => (int) round(self::FORECAST_TTL_SECONDS / 3600),
            ],
            'hourly' => [
                'cached' => $hourly->isNotEmpty(),
                'valid' => $this->hourlyIsFresh($hourly, 24),
                'hoursCached' => $hourly->count(),
                'cachedAt' => $hourly->max('updated_at')?->toIso8601String(),
                'ttlHours' => (int) round(self::HOURLY_TTL_SECONDS / 3600),
            ],
        ];
    }

    public function refreshWeatherCache(float $lat, float $lng): array
    {
        $current = $this->currentWeather($lat, $lng, true);
        $forecast = $this->dailyForecast($lat, $lng, 7, true);
        $hourly = $this->hourlyForecast($lat, $lng, 24, true);

        return [
            'locationKey' => $this->locationKey($lat, $lng),
            'source' => 'provider',
            'current' => $current,
            'forecast' => $forecast,
            'hourly' => $hourly,
        ];
    }

    public function activeWeatherAlerts(?int $districtId = null): Collection
    {
        if ($districtId === null) {
            return $this->alerts->activeAlerts();
        }

        return $this->alerts->alertsForDistrict($districtId)
            ->filter(fn (WeatherAlert $alert): bool => $alert->valid_until === null || $alert->valid_until->gte(now()))
            ->values();
    }

    public function generateWeatherAlerts(int $districtId, string $locationKey, int $issuedByUserId): int
    {
        $forecasts = $this->forecasts->getWeatherHistory($locationKey, 7)
            ->filter(fn (WeatherForecast $forecast): bool => $forecast->forecast_date !== null
                && $forecast->forecast_date->gte(today()));

        $created = 0;

        foreach ($forecasts as $forecast) {
            foreach ($this->evaluateForecast($forecast) as $alert) {
                $duplicate = $this->alerts->findFirstWhere([
                    'district_id' => $districtId,
                    'alert_type' => $alert['alert_type'],
                ]);

                if ($duplicate !== null) {
                    continue;
                }

                $this->alerts->create([
                    'district_id' => $districtId,
                    'issued_by' => $issuedByUserId,
                    ...$alert,
                ]);

                $created++;
            }
        }

        return $created;
    }

    public function activeAlerts(): Collection
    {
        return $this->alerts->activeAlerts();
    }

    public function alertsForDistrict(int $districtId): Collection
    {
        return $this->alerts->alertsForDistrict($districtId);
    }

    public function rainPrediction(float $lat, float $lng, int $days = 7): array
    {
        $locationKey = $this->locationKey($lat, $lng);
        $forecast = $this->dailyForecast($lat, $lng, $days);

        $rows = array_map(
            fn (array $day): array => [
                'forecastDate' => $day['forecastDate'],
                'rainfallProbabilityPct' => $day['rainfallProbabilityPct'],
            ],
            $forecast['days'],
        );

        $probabilities = array_column($rows, 'rainfallProbabilityPct');
        $maxProbability = $probabilities !== [] ? max($probabilities) : null;
        $maxDay = null;

        foreach ($rows as $row) {
            if ($row['rainfallProbabilityPct'] === $maxProbability && $maxDay === null) {
                $maxDay = $row['forecastDate'];
            }
        }

        return [
            'locationKey' => $locationKey,
            'source' => $forecast['source'],
            'days' => $rows,
            'maxProbabilityPct' => $maxProbability,
            'maxDay' => $maxDay,
            'rainExpected' => $maxProbability !== null && $maxProbability >= 50,
            'averageProbabilityPct' => $probabilities !== []
                ? (int) round(array_sum($probabilities) / count($probabilities))
                : null,
        ];
    }

    public function temperatureTrend(float $lat, float $lng, int $days = 7): array
    {
        $locationKey = $this->locationKey($lat, $lng);
        $forecast = $this->dailyForecast($lat, $lng, $days);

        $rows = array_map(
            fn (array $day): array => [
                'forecastDate' => $day['forecastDate'],
                'tempMaxC' => $day['tempMaxC'],
                'tempMinC' => $day['tempMinC'],
                'tempAvgC' => round(($day['tempMaxC'] + $day['tempMinC']) / 2, 1),
            ],
            $forecast['days'],
        );

        $maxima = array_column($rows, 'tempMaxC');
        $minima = array_column($rows, 'tempMinC');

        if ($maxima === []) {
            return [
                'locationKey' => $locationKey,
                'source' => $forecast['source'],
                'days' => [],
                'avgMaxC' => null,
                'avgMinC' => null,
                'deltaMaxC' => null,
                'direction' => 'steady',
            ];
        }

        $delta = (float) end($maxima) - (float) reset($maxima);

        return [
            'locationKey' => $locationKey,
            'source' => $forecast['source'],
            'days' => $rows,
            'avgMaxC' => round(array_sum($maxima) / count($maxima), 1),
            'avgMinC' => round(array_sum($minima) / count($minima), 1),
            'deltaMaxC' => round($delta, 1),
            'direction' => $delta > 1 ? 'rising' : ($delta < -1 ? 'falling' : 'steady'),
        ];
    }

    public function humidityTrend(float $lat, float $lng, int $days = 7): array
    {
        $locationKey = $this->locationKey($lat, $lng);
        $forecast = $this->dailyForecast($lat, $lng, $days);

        $rows = array_map(
            fn (array $day): array => [
                'forecastDate' => $day['forecastDate'],
                'humidityPct' => $day['humidityPct'],
            ],
            $forecast['days'],
        );

        $values = array_column($rows, 'humidityPct');
        $humidityValues = array_filter($values, fn ($v) => $v !== null);

        return [
            'locationKey' => $locationKey,
            'source' => $forecast['source'],
            'days' => $rows,
            'avgHumidityPct' => $humidityValues !== []
                ? (int) round(array_sum($humidityValues) / count($humidityValues))
                : null,
            'peakHumidityPct' => $humidityValues !== [] ? max($humidityValues) : null,
        ];
    }

    public function windSummary(float $lat, float $lng): array
    {
        $locationKey = $this->locationKey($lat, $lng);
        $current = $this->currentWeather($lat, $lng);
        $forecast = $this->dailyForecast($lat, $lng, 7);

        $speeds = array_column($forecast['days'], 'windSpeedKmh');
        $maxSpeed = null;
        $maxDay = null;

        foreach ($forecast['days'] as $day) {
            if ($day['windSpeedKmh'] !== null && ($maxSpeed === null || $day['windSpeedKmh'] > $maxSpeed)) {
                $maxSpeed = $day['windSpeedKmh'];
                $maxDay = $day['forecastDate'];
            }
        }

        return [
            'locationKey' => $locationKey,
            'currentSpeedKmh' => $current['windSpeedKmh'],
            'currentDirection' => $current['windDirection'],
            'forecastMaxKmh' => $maxSpeed,
            'maxDay' => $maxDay,
            'averageKmh' => $speeds !== []
                ? round(array_sum($speeds) / count($speeds), 1)
                : null,
        ];
    }

    public function uvSummary(float $lat, float $lng): array
    {
        $locationKey = $this->locationKey($lat, $lng);
        $current = $this->currentWeather($lat, $lng);
        $hourly = $this->hourlyForecast($lat, $lng, 24);

        $uvValues = array_column($hourly['hours'], 'uvIndex');
        $peak = $uvValues !== [] ? max($uvValues) : null;
        $peakTime = null;

        foreach ($hourly['hours'] as $hour) {
            if ($hour['uvIndex'] === $peak && $peakTime === null) {
                $peakTime = $hour['forecastTime'];
            }
        }

        return [
            'locationKey' => $locationKey,
            'currentUvIndex' => $current['uvIndex'],
            'category' => $this->uvCategory($current['uvIndex']),
            'peakUvIndex' => $peak,
            'peakTime' => $peakTime,
            'advisory' => $this->uvAdvisory($peak),
        ];
    }

    public function sunTimes(float $lat, float $lng): array
    {
        $locationKey = $this->locationKey($lat, $lng);
        $current = $this->currentWeather($lat, $lng);
        $sunrise = $current['sunriseAt'];
        $sunset = $current['sunsetAt'];

        if ($sunrise === null || $sunset === null) {
            $today = $this->forecasts->getForecast($locationKey);

            if ($today !== null && $today->forecast_date?->isToday()) {
                $sunrise = $today->sunrise_at?->toIso8601String() ?? $sunrise;
                $sunset = $today->sunset_at?->toIso8601String() ?? $sunset;
            }
        }

        $daylightHours = null;

        if ($sunrise !== null && $sunset !== null) {
            try {
                $daylightHours = round(Carbon::parse($sunrise)->diffInHours(Carbon::parse($sunset)), 1);
            } catch (\Throwable) {
                $daylightHours = null;
            }
        }

        return [
            'locationKey' => $locationKey,
            'sunriseAt' => $sunrise,
            'sunsetAt' => $sunset,
            'daylightHours' => $daylightHours,
        ];
    }

    public function weatherSummary(float $lat, float $lng): array
    {
        $locationKey = $this->locationKey($lat, $lng);
        $current = $this->currentWeather($lat, $lng);
        $today = $this->dailyForecast($lat, $lng, 1)['days'][0] ?? null;

        $parts = [];
        $parts[] = $current['condition'].' with '.sprintf('%.1fÂ°C', $current['temperatureC']);

        if ($current['humidityPct'] !== null) {
            $parts[] = $current['humidityPct'].'% humidity';
        }

        if ($current['windSpeedKmh'] !== null) {
            $parts[] = 'wind '.sprintf('%.0f km/h', $current['windSpeedKmh']);
        }

        if ($today !== null && $today['rainfallProbabilityPct'] !== null) {
            $parts[] = sprintf('%d%% chance of rain today', $today['rainfallProbabilityPct']);
        }

        return [
            'locationKey' => $locationKey,
            'temperatureC' => $current['temperatureC'],
            'feelsLikeC' => $current['feelsLikeC'],
            'condition' => $current['condition'],
            'humidityPct' => $current['humidityPct'],
            'windSpeedKmh' => $current['windSpeedKmh'],
            'uvIndex' => $current['uvIndex'],
            'rainfallMm' => $current['rainfallMm'],
            'sunriseAt' => $current['sunriseAt'],
            'sunsetAt' => $current['sunsetAt'],
            'summary' => implode(', ', $parts).'.',
        ];
    }

    public function farmerWeatherDashboard(int $userId, float $lat, float $lng, ?int $districtId = null): array
    {
        $current = $this->currentWeather($lat, $lng);
        $today = $this->dailyForecast($lat, $lng, 1)['days'][0] ?? null;
        $alerts = $this->activeWeatherAlerts($districtId);
        $summary = $this->weatherSummary($lat, $lng);

        return [
            'locationKey' => $this->locationKey($lat, $lng),
            'current' => $current,
            'todayForecast' => $today,
            'alerts' => $alerts->map(fn (WeatherAlert $alert): array => $this->alertPayload($alert))->values()->all(),
            'summary' => $summary,
        ];
    }

    public function severeWeatherNotifications(int $userId, ?int $districtId): array
    {
        if ($districtId === null) {
            throw new DomainException('A district is required to generate severe weather notifications.');
        }

        $severeAlerts = $this->alerts->alertsForDistrict($districtId)
            ->filter(fn (WeatherAlert $alert): bool => $alert->severity === 'High'
                && ($alert->valid_until === null || $alert->valid_until->gte(now())));

        $created = 0;
        $notifications = [];

        foreach ($severeAlerts as $alert) {
            $existing = $this->notifications->findFirstWhere([
                'user_id' => $userId,
                'type' => 'WEATHER',
                'source_ref' => (string) $alert->id,
            ]);

            if ($existing !== null) {
                $notifications[] = $existing;

                continue;
            }

            $notification = $this->notifications->create([
                'user_id' => $userId,
                'type' => 'WEATHER',
                'title' => $alert->title,
                'message' => $alert->message,
                'source_ref' => (string) $alert->id,
                'is_read' => false,
            ]);

            $notifications[] = $notification;
            $created++;
        }

        return [
            'created' => $created,
            'notifications' => new Collection($notifications),
        ];
    }

    public function listWeatherNotifications(int $userId): Collection
    {
        return $this->notifications->forUserByType($userId, 'WEATHER');
    }

    /**
     * @return array<string, mixed>
     */
    private function currentPayload(WeatherCache $cache, string $source): array
    {
        return [
            'locationKey' => (string) $cache->location_key,
            'source' => $source,
            'temperatureC' => (float) $cache->temperature_c,
            'feelsLikeC' => $cache->feels_like_c !== null ? (float) $cache->feels_like_c : null,
            'humidityPct' => $cache->humidity_pct,
            'rainfallMm' => $cache->rainfall_mm !== null ? (float) $cache->rainfall_mm : null,
            'windSpeedKmh' => $cache->wind_speed_kmh !== null ? (float) $cache->wind_speed_kmh : null,
            'windDirection' => $cache->wind_direction,
            'condition' => $cache->condition,
            'uvIndex' => $cache->uv_index,
            'airQualityIndex' => $cache->air_quality_index,
            'sunriseAt' => $cache->sunrise_at?->toIso8601String(),
            'sunsetAt' => $cache->sunset_at?->toIso8601String(),
            'observedAt' => $cache->observed_at?->toIso8601String(),
            'cachedAt' => $cache->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @param  Collection<int, WeatherForecast>  $rows
     * @return array<string, mixed>
     */
    private function dailyPayload(string $locationKey, Collection $rows, string $source): array
    {
        return [
            'locationKey' => $locationKey,
            'source' => $source,
            'days' => $rows->map(fn (WeatherForecast $f): array => $this->dailyRowPayload($f))->values()->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function dailyRowPayload(WeatherForecast $forecast): array
    {
        return [
            'forecastDate' => $forecast->forecast_date?->toDateString(),
            'day' => $forecast->day,
            'tempMaxC' => (float) $forecast->temp_max_c,
            'tempMinC' => (float) $forecast->temp_min_c,
            'condition' => $forecast->condition,
            'rainfallProbabilityPct' => $forecast->rainfall_probability_pct,
            'humidityPct' => $forecast->humidity_pct,
            'windSpeedKmh' => $forecast->wind_speed_kmh !== null ? (float) $forecast->wind_speed_kmh : null,
            'irrigationNeeded' => (bool) $forecast->irrigation_needed,
            'diseaseRisk' => $forecast->disease_risk,
            'sunriseAt' => $forecast->sunrise_at?->toIso8601String(),
            'sunsetAt' => $forecast->sunset_at?->toIso8601String(),
        ];
    }

    /**
     * @param  Collection<int, WeatherHourlyForecast>  $rows
     * @return array<string, mixed>
     */
    private function hourlyPayload(string $locationKey, Collection $rows, string $source): array
    {
        return [
            'locationKey' => $locationKey,
            'source' => $source,
            'hours' => $rows->map(fn (WeatherHourlyForecast $row): array => [
                'forecastTime' => $row->forecast_time?->toIso8601String(),
                'temperatureC' => (float) $row->temperature_c,
                'humidityPct' => $row->humidity_pct,
                'precipitationProbabilityPct' => $row->precipitation_probability_pct,
                'windSpeedKmh' => $row->wind_speed_kmh !== null ? (float) $row->wind_speed_kmh : null,
                'uvIndex' => $row->uv_index,
                'condition' => $row->condition,
            ])->values()->all(),
        ];
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function upsertCache(string $locationKey, array $payload): WeatherCache
    {
        $data = [
            'location_key' => $locationKey,
            'temperature_c' => (float) $payload['temperature_c'],
            'feels_like_c' => $payload['feels_like_c'] ?? null,
            'humidity_pct' => $payload['humidity_pct'] ?? null,
            'rainfall_mm' => $payload['rainfall_mm'] ?? null,
            'wind_speed_kmh' => $payload['wind_speed_kmh'] ?? null,
            'wind_direction' => $payload['wind_direction'] ?? null,
            'condition' => (string) ($payload['condition'] ?? 'Unknown'),
            'uv_index' => $payload['uv_index'] ?? null,
            'sunrise_at' => $payload['sunrise_at'] ?? null,
            'sunset_at' => $payload['sunset_at'] ?? null,
            'observed_at' => now(),
        ];

        $existing = $this->weatherCache->findFirstWhere(['location_key' => $locationKey]);

        if ($existing === null) {
            return $this->weatherCache->create($data);
        }

        return $this->weatherCache->update((int) $existing->id, $data) ?? $existing;
    }

    /**
     * @param  array<int, array<string, mixed>>  $fetched
     * @return Collection<int, WeatherForecast>
     */
    private function persistDaily(string $locationKey, array $fetched): Collection
    {
        foreach ($fetched as $row) {
            $data = [
                'location_key' => $locationKey,
                'forecast_date' => $row['forecast_date'],
                'day' => $row['day'],
                'temp_max_c' => $row['temp_max_c'],
                'temp_min_c' => $row['temp_min_c'],
                'condition' => $row['condition'],
                'rainfall_probability_pct' => $row['rainfall_probability_pct'] ?? null,
                'humidity_pct' => $row['humidity_pct'] ?? null,
                'wind_speed_kmh' => $row['wind_speed_kmh'] ?? null,
                'sunrise_at' => $row['sunrise_at'] ?? null,
                'sunset_at' => $row['sunset_at'] ?? null,
                'irrigation_needed' => $this->irrigationNeeded(
                    $row['rainfall_probability_pct'] ?? null,
                    $row['temp_max_c'],
                ),
                'disease_risk' => $this->diseaseRisk($row['humidity_pct'] ?? null),
                'provider' => 'open-meteo',
            ];

            $existing = $this->forecasts->findFirstWhere([
                'location_key' => $locationKey,
                'forecast_date' => $row['forecast_date'],
            ]);

            if ($existing === null) {
                $this->forecasts->create($data);
            } else {
                $this->forecasts->update((int) $existing->id, $data);
            }
        }

        return $this->forecasts->forecastsBetween(
            $locationKey,
            $fetched[0]['forecast_date'] ?? today()->toDateString(),
            $fetched[count($fetched) - 1]['forecast_date'] ?? today()->toDateString(),
        );
    }

    /**
     * @param  array<int, array<string, mixed>>  $fetched
     * @return Collection<int, WeatherHourlyForecast>
     */
    private function persistHourly(string $locationKey, array $fetched): Collection
    {
        foreach ($fetched as $row) {
            $data = [
                'location_key' => $locationKey,
                'forecast_time' => $row['forecast_time'],
                'temperature_c' => $row['temperature_c'],
                'humidity_pct' => $row['humidity_pct'] ?? null,
                'precipitation_probability_pct' => $row['precipitation_probability_pct'] ?? null,
                'wind_speed_kmh' => $row['wind_speed_kmh'] ?? null,
                'uv_index' => $row['uv_index'] ?? null,
                'condition' => $row['condition'],
                'provider' => 'open-meteo',
            ];

            $existing = $this->hourlyForecasts->findFirstWhere([
                'location_key' => $locationKey,
                'forecast_time' => $row['forecast_time'],
            ]);

            if ($existing === null) {
                $this->hourlyForecasts->create($data);
            } else {
                $this->hourlyForecasts->update((int) $existing->id, $data);
            }
        }

        return $this->hourlyForecasts->getHourlyForecasts($locationKey, 24);
    }

    /**
     * @return Collection<int, WeatherForecast>
     */
    private function dailyRows(string $locationKey, int $days): Collection
    {
        return $this->forecasts->forecastsBetween(
            $locationKey,
            today()->toDateString(),
            today()->addDays($days - 1)->toDateString(),
        );
    }

    /**
     * @return Collection<int, WeatherHourlyForecast>
     */
    private function hourlyRows(string $locationKey, int $hours): Collection
    {
        return $this->hourlyForecasts->getHourlyForecasts($locationKey, $hours);
    }

    /**
     * @param  Collection<int, WeatherForecast>  $rows
     */
    private function dailyIsFresh(Collection $rows, int $days): bool
    {
        if ($rows->count() < $days) {
            return false;
        }

        return $this->collectionIsFresh($rows, self::FORECAST_TTL_SECONDS);
    }

    /**
     * @param  Collection<int, WeatherHourlyForecast>  $rows
     */
    private function hourlyIsFresh(Collection $rows, int $hours): bool
    {
        if ($rows->count() < $hours) {
            return false;
        }

        return $this->collectionIsFresh($rows, self::HOURLY_TTL_SECONDS);
    }

    /**
     * @param  Collection<int, mixed>  $rows
     */
    private function collectionIsFresh(Collection $rows, int $ttlSeconds): bool
    {
        $oldestUpdate = $rows->min('updated_at');

        return $oldestUpdate !== null && $this->isFresh($oldestUpdate, $ttlSeconds);
    }

    private function isFresh(?Carbon $timestamp, int $ttlSeconds): bool
    {
        return $timestamp !== null && $timestamp->gte(now()->subSeconds($ttlSeconds));
    }

    private function locationKeyFor(float $lat, float $lng): string
    {
        return sprintf('%.4f,%.4f', $lat, $lng);
    }

    private function irrigationNeeded(?int $rainProbabilityPct, float $tempMaxC): bool
    {
        return ($rainProbabilityPct === null || $rainProbabilityPct < 40) && $tempMaxC >= 32;
    }

    private function diseaseRisk(?int $humidityPct): string
    {
        if ($humidityPct === null || $humidityPct < 60) {
            return 'Low';
        }

        return $humidityPct >= 70 ? 'High' : 'Medium';
    }

    private function uvCategory(?int $uv): string
    {
        if ($uv === null) {
            return 'Unknown';
        }

        return match (true) {
            $uv <= 2 => 'Low',
            $uv <= 5 => 'Moderate',
            $uv <= 7 => 'High',
            $uv <= 10 => 'Very High',
            default => 'Extreme',
        };
    }

    private function uvAdvisory(?int $uv): ?string
    {
        if ($uv === null) {
            return null;
        }

        return match (true) {
            $uv <= 2 => 'Safe for outdoor work.',
            $uv <= 5 => 'Use sunscreen if working outdoors for extended periods.',
            $uv <= 7 => 'Wear a hat and take shade breaks between field tasks.',
            $uv <= 10 => 'Avoid peak-sun field work; protect exposed skin.',
            default => 'Stay indoors during midday; risk of sunburn within minutes.',
        };
    }

    /**
     * @return array<string, mixed>
     */
    private function alertPayload(WeatherAlert $alert): array
    {
        return [
            'id' => (int) $alert->id,
            'alertType' => $alert->alert_type,
            'severity' => $alert->severity,
            'districtId' => (int) $alert->district_id,
            'title' => $alert->title,
            'message' => $alert->message,
            'validFrom' => $alert->valid_from?->toIso8601String(),
            'validUntil' => $alert->valid_until?->toIso8601String(),
            'issuedBy' => (int) $alert->issued_by,
        ];
    }

    /**
     * Translate forecast values into alert payloads (pure business rule).
     *
     * @return array<int, array{alert_type: string, severity: string, title: string, message: string, valid_from: \Carbon\Carbon, valid_until: \Carbon\Carbon}>
     */
    private function evaluateForecast(WeatherForecast $forecast): array
    {
        $alerts = [];

        if ((int) $forecast->rainfall_probability_pct >= self::HEAVY_RAIN_THRESHOLD_PCT) {
            $alerts[] = [
                'alert_type' => 'HEAVY_RAIN',
                'severity' => 'High',
                'title' => 'Heavy rainfall expected',
                'message' => sprintf(
                    '%d%% chance of rainfall on %s. Protect harvests and drainage.',
                    (int) $forecast->rainfall_probability_pct,
                    $forecast->forecast_date?->toDateString() ?? 'the forecast date'
                ),
                'valid_from' => $forecast->forecast_date ?? now(),
                'valid_until' => $forecast->forecast_date?->endOfDay() ?? now(),
            ];
        }

        if ((float) $forecast->temp_max_c >= self::HEATWAVE_THRESHOLD_C) {
            $alerts[] = [
                'alert_type' => 'HEATWAVE',
                'severity' => 'High',
                'title' => 'Heatwave conditions',
                'message' => sprintf(
                    'Temperatures may reach %.1fÂ°C. Irrigate early morning and shade seedlings.',
                    (float) $forecast->temp_max_c
                ),
                'valid_from' => $forecast->forecast_date ?? now(),
                'valid_until' => $forecast->forecast_date?->endOfDay() ?? now(),
            ];
        }

        if ((float) $forecast->temp_min_c <= self::COLD_WAVE_THRESHOLD_C) {
            $alerts[] = [
                'alert_type' => 'COLD_WAVE',
                'severity' => 'Moderate',
                'title' => 'Cold wave expected',
                'message' => sprintf(
                    'Minimum temperature may drop to %.1fÂ°C. Protect tender crops overnight.',
                    (float) $forecast->temp_min_c
                ),
                'valid_from' => $forecast->forecast_date ?? now(),
                'valid_until' => $forecast->forecast_date?->endOfDay() ?? now(),
            ];
        }

        if ((float) $forecast->wind_speed_kmh >= self::HIGH_WIND_THRESHOLD_KMH) {
            $alerts[] = [
                'alert_type' => 'HIGH_WIND',
                'severity' => 'Moderate',
                'title' => 'High wind speed',
                'message' => sprintf(
                    'Winds up to %.1f km/h expected. Secure nets, shades, and structures.',
                    (float) $forecast->wind_speed_kmh
                ),
                'valid_from' => $forecast->forecast_date ?? now(),
                'valid_until' => $forecast->forecast_date?->endOfDay() ?? now(),
            ];
        }

        return $alerts;
    }
}
