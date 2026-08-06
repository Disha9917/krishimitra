<?php

declare(strict_types=1);

namespace App\Services\Weather;

use App\Models\WeatherAlert;
use App\Models\WeatherCache;
use App\Models\WeatherForecast;
use App\Repositories\Contracts\WeatherAlertRepositoryInterface;
use App\Repositories\Contracts\WeatherCacheRepositoryInterface;
use App\Repositories\Contracts\WeatherForecastRepositoryInterface;
use App\Services\Common\DTO\WeatherSnapshotDTO;
use Illuminate\Database\Eloquent\Collection;

class WeatherService implements WeatherServiceInterface
{
    private const HEAVY_RAIN_THRESHOLD_PCT = 70;

    private const HEATWAVE_THRESHOLD_C = 45;

    private const COLD_WAVE_THRESHOLD_C = 5;

    private const HIGH_WIND_THRESHOLD_KMH = 40;

    public function __construct(
        private readonly WeatherCacheRepositoryInterface $weatherCache,
        private readonly WeatherForecastRepositoryInterface $forecasts,
        private readonly WeatherAlertRepositoryInterface $alerts,
    ) {
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

    public function refreshCache(array $payload): WeatherCache
    {
        $locationKey = (string) ($payload['location_key'] ?? '');

        if ($locationKey === '') {
            throw new \InvalidArgumentException('location_key is required to refresh the weather cache.');
        }

        $payload['observed_at'] = $payload['observed_at'] ?? now();

        $existing = $this->weatherCache->findFirstWhere(['location_key' => $locationKey]);

        if ($existing === null) {
            return $this->weatherCache->create($payload);
        }

        return $this->weatherCache->update((int) $existing->id, $payload) ?? $existing;
    }

    public function generateWeatherAlerts(int $districtId, string $locationKey, int $issuedByUserId): int
    {
        $forecasts = $this->forecasts->getWeatherHistory($locationKey, 7)
            ->filter(fn (WeatherForecast $forecast): bool => $forecast->forecast_date !== null
                && !$forecast->forecast_date->isPast());

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
                'severity' => 'HIGH',
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
                'severity' => 'HIGH',
                'title' => 'Heatwave conditions',
                'message' => sprintf(
                    'Temperatures may reach %.1f°C. Irrigate early morning and shade seedlings.',
                    (float) $forecast->temp_max_c
                ),
                'valid_from' => $forecast->forecast_date ?? now(),
                'valid_until' => $forecast->forecast_date?->endOfDay() ?? now(),
            ];
        }

        if ((float) $forecast->temp_min_c <= self::COLD_WAVE_THRESHOLD_C) {
            $alerts[] = [
                'alert_type' => 'COLD_WAVE',
                'severity' => 'MEDIUM',
                'title' => 'Cold wave expected',
                'message' => sprintf(
                    'Minimum temperature may drop to %.1f°C. Protect tender crops overnight.',
                    (float) $forecast->temp_min_c
                ),
                'valid_from' => $forecast->forecast_date ?? now(),
                'valid_until' => $forecast->forecast_date?->endOfDay() ?? now(),
            ];
        }

        if ((float) $forecast->wind_speed_kmh >= self::HIGH_WIND_THRESHOLD_KMH) {
            $alerts[] = [
                'alert_type' => 'HIGH_WIND',
                'severity' => 'MEDIUM',
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
