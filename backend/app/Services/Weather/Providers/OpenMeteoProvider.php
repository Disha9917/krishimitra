<?php

declare(strict_types=1);

namespace App\Services\Weather\Providers;

use App\Services\Weather\Exceptions\WeatherProviderException;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

/**
 * Open-Meteo provider (https://open-meteo.com).
 */
class OpenMeteoProvider implements WeatherProviderInterface
{
    private const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

    /**
     * Map of WMO weather codes to readable conditions.
     *
     * @var array<int, string>
     */
    private const WMO_CONDITIONS = [
        0 => 'Clear',
        1 => 'Mostly Clear',
        2 => 'Partly Cloudy',
        3 => 'Overcast',
        45 => 'Foggy',
        48 => 'Icy Fog',
        51 => 'Light Drizzle',
        53 => 'Drizzle',
        55 => 'Heavy Drizzle',
        56 => 'Freezing Drizzle',
        57 => 'Freezing Drizzle',
        61 => 'Light Rain',
        63 => 'Rain',
        65 => 'Heavy Rain',
        66 => 'Freezing Rain',
        67 => 'Freezing Rain',
        71 => 'Light Snow',
        73 => 'Snow',
        75 => 'Heavy Snow',
        77 => 'Snow Grains',
        80 => 'Light Showers',
        81 => 'Showers',
        82 => 'Violent Showers',
        85 => 'Snow Showers',
        86 => 'Snow Showers',
        95 => 'Thunderstorm',
        96 => 'Thunderstorm with Hail',
        99 => 'Thunderstorm with Hail',
    ];

    public function fetchCurrent(float $lat, float $lng): array
    {
        $data = $this->get([
            'current' => implode(',', [
                'temperature_2m',
                'apparent_temperature',
                'relative_humidity_2m',
                'precipitation',
                'wind_speed_10m',
                'wind_direction_10m',
                'weather_code',
                'uv_index',
            ]),
            'daily' => 'sunrise,sunset',
            'forecast_days' => 1,
        ], $lat, $lng);

        $current = $data['current'] ?? null;

        if (! is_array($current) || ! isset($current['temperature_2m'])) {
            throw new WeatherProviderException('Open-Meteo returned no current weather data.');
        }

        $sunrise = $data['daily']['sunrise'][0] ?? null;
        $sunset = $data['daily']['sunset'][0] ?? null;

        return [
            'temperature_c' => (float) $current['temperature_2m'],
            'feels_like_c' => $current['apparent_temperature'] !== null ? (float) $current['apparent_temperature'] : null,
            'humidity_pct' => $current['relative_humidity_2m'] !== null ? (int) $current['relative_humidity_2m'] : null,
            'rainfall_mm' => $current['precipitation'] !== null ? (float) $current['precipitation'] : null,
            'wind_speed_kmh' => $current['wind_speed_10m'] !== null ? (float) $current['wind_speed_10m'] : null,
            'wind_direction' => $current['wind_direction_10m'] !== null ? $this->direction((float) $current['wind_direction_10m']) : null,
            'condition' => $this->condition((int) ($current['weather_code'] ?? 0)),
            'uv_index' => $current['uv_index'] !== null ? (int) $current['uv_index'] : null,
            'sunrise_at' => $sunrise !== null ? CarbonImmutable::parse($sunrise)->toDateTimeString() : null,
            'sunset_at' => $sunset !== null ? CarbonImmutable::parse($sunset)->toDateTimeString() : null,
        ];
    }

    public function fetchDaily(float $lat, float $lng, int $days = 7, int $pastDays = 0): array
    {
        $data = $this->get([
            'daily' => implode(',', [
                'weather_code',
                'temperature_2m_max',
                'temperature_2m_min',
                'precipitation_probability_max',
                'relative_humidity_2m_mean',
                'wind_speed_10m_max',
                'sunrise',
                'sunset',
            ]),
            'forecast_days' => max(1, $days),
            'past_days' => max(0, $pastDays),
        ], $lat, $lng);

        $daily = $data['daily'] ?? null;

        if (! is_array($daily) || ! isset($daily['time'])) {
            throw new WeatherProviderException('Open-Meteo returned no daily forecast data.');
        }

        $rows = [];

        foreach ($daily['time'] as $index => $date) {
            $rows[] = [
                'forecast_date' => (string) $date,
                'day' => CarbonImmutable::parse((string) $date)->format('l'),
                'temp_max_c' => (float) $daily['temperature_2m_max'][$index],
                'temp_min_c' => (float) $daily['temperature_2m_min'][$index],
                'condition' => $this->condition((int) ($daily['weather_code'][$index] ?? 0)),
                'rainfall_probability_pct' => $daily['precipitation_probability_max'][$index] !== null
                    ? (int) $daily['precipitation_probability_max'][$index]
                    : null,
                'humidity_pct' => $daily['relative_humidity_2m_mean'][$index] !== null
                    ? (int) $daily['relative_humidity_2m_mean'][$index]
                    : null,
                'wind_speed_kmh' => $daily['wind_speed_10m_max'][$index] !== null
                    ? (float) $daily['wind_speed_10m_max'][$index]
                    : null,
                'sunrise_at' => isset($daily['sunrise'][$index]) && $daily['sunrise'][$index] !== null
                    ? CarbonImmutable::parse((string) $daily['sunrise'][$index])->toDateTimeString()
                    : null,
                'sunset_at' => isset($daily['sunset'][$index]) && $daily['sunset'][$index] !== null
                    ? CarbonImmutable::parse((string) $daily['sunset'][$index])->toDateTimeString()
                    : null,
            ];
        }

        return $rows;
    }

    public function fetchHourly(float $lat, float $lng, int $hours = 24): array
    {
        $data = $this->get([
            'hourly' => implode(',', [
                'temperature_2m',
                'relative_humidity_2m',
                'precipitation_probability',
                'wind_speed_10m',
                'uv_index',
                'weather_code',
            ]),
            'forecast_hours' => max(1, $hours),
        ], $lat, $lng);

        $hourly = $data['hourly'] ?? null;

        if (! is_array($hourly) || ! isset($hourly['time'])) {
            throw new WeatherProviderException('Open-Meteo returned no hourly forecast data.');
        }

        $rows = [];

        foreach ($hourly['time'] as $index => $time) {
            $rows[] = [
                'forecast_time' => CarbonImmutable::parse((string) $time)->toDateTimeString(),
                'temperature_c' => (float) $hourly['temperature_2m'][$index],
                'humidity_pct' => $hourly['relative_humidity_2m'][$index] !== null
                    ? (int) $hourly['relative_humidity_2m'][$index]
                    : null,
                'precipitation_probability_pct' => $hourly['precipitation_probability'][$index] !== null
                    ? (int) $hourly['precipitation_probability'][$index]
                    : null,
                'wind_speed_kmh' => $hourly['wind_speed_10m'][$index] !== null
                    ? (float) $hourly['wind_speed_10m'][$index]
                    : null,
                'uv_index' => $hourly['uv_index'][$index] !== null
                    ? (int) $hourly['uv_index'][$index]
                    : null,
                'condition' => $this->condition((int) ($hourly['weather_code'][$index] ?? 0)),
            ];
        }

        return $rows;
    }

    /**
     * @param  array<string, string|int>  $query
     * @return array<string, mixed>
     */
    private function get(array $query, float $lat, float $lng): array
    {
        try {
            $response = Http::timeout(15)
                ->get(self::BASE_URL, [
                    'latitude' => $lat,
                    'longitude' => $lng,
                    'timezone' => 'UTC',
                    ...$query,
                ]);
        } catch (ConnectionException $e) {
            throw new WeatherProviderException('Weather provider is unreachable: '.$e->getMessage(), 0, $e);
        }

        try {
            $response->throw();
        } catch (RequestException $e) {
            throw new WeatherProviderException('Weather provider error ('.$response->status().').', 0, $e);
        }

        $payload = $response->json();

        if (! is_array($payload)) {
            throw new WeatherProviderException('Weather provider returned an invalid response.');
        }

        if (isset($payload['error']) && $payload['error'] === true) {
            throw new WeatherProviderException('Weather provider rejected the request: '.($payload['reason'] ?? 'unknown error'));
        }

        return $payload;
    }

    private function condition(int $wmoCode): string
    {
        return self::WMO_CONDITIONS[$wmoCode] ?? 'Unknown';
    }

    private function direction(float $degrees): string
    {
        $directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        $index = (int) round($degrees / 22.5) % 16;

        return $directions[$index];
    }
}
