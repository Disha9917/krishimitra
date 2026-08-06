<?php

declare(strict_types=1);

namespace App\Services\Common\DTO;

use App\Models\WeatherCache;
use Carbon\Carbon;

/**
 * Immutable snapshot of the latest observed weather for a location.
 */
final readonly class WeatherSnapshotDTO
{
    public function __construct(
        public string $locationKey,
        public float $temperatureC,
        public ?float $feelsLikeC = null,
        public ?int $humidityPct = null,
        public ?float $rainfallMm = null,
        public ?float $windSpeedKmh = null,
        public ?string $windDirection = null,
        public ?string $condition = null,
        public ?int $uvIndex = null,
        public ?int $airQualityIndex = null,
        public ?Carbon $observedAt = null,
    ) {
    }

    public static function fromModel(WeatherCache $cache): self
    {
        return new self(
            locationKey: (string) $cache->location_key,
            temperatureC: (float) $cache->temperature_c,
            feelsLikeC: $cache->feels_like_c !== null ? (float) $cache->feels_like_c : null,
            humidityPct: $cache->humidity_pct,
            rainfallMm: $cache->rainfall_mm !== null ? (float) $cache->rainfall_mm : null,
            windSpeedKmh: $cache->wind_speed_kmh !== null ? (float) $cache->wind_speed_kmh : null,
            windDirection: $cache->wind_direction,
            condition: $cache->condition,
            uvIndex: $cache->uv_index,
            airQualityIndex: $cache->air_quality_index,
            observedAt: $cache->observed_at,
        );
    }
}
