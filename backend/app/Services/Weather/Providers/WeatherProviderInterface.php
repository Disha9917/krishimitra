<?php

declare(strict_types=1);

namespace App\Services\Weather\Providers;

/**
 * Normalized weather provider contract.
 */
interface WeatherProviderInterface
{
    /**
     * Current conditions for a coordinate.
     *
     * @return array<string, mixed> Normalized current conditions payload
     */
    public function fetchCurrent(float $lat, float $lng): array;

    /**
     * Daily forecast for a coordinate.
     *
     * @return array<int, array<string, mixed>> Normalized daily forecast rows
     */
    public function fetchDaily(float $lat, float $lng, int $days = 7, int $pastDays = 0): array;

    /**
     * Hourly forecast for a coordinate.
     *
     * @return array<int, array<string, mixed>> Normalized hourly forecast rows
     */
    public function fetchHourly(float $lat, float $lng, int $hours = 24): array;
}
