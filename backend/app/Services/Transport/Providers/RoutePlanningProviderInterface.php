<?php

declare(strict_types=1);

namespace App\Services\Transport\Providers;

/**
 * Route planning contract.
 *
 * Currently rule-based (RuleBasedRoutePlanner). Swap the concrete binding
 * in ServiceServiceProvider to plug in Google Maps, Mapbox or OpenRouteService
 * without touching any controller or service.
 */
interface RoutePlanningProviderInterface
{
    /**
     * Estimate distance and duration for a trip between source and destination.
     *
     * @param  array{
     *     origin: string,
     *     destination: string,
     *     origin_lat?: float|null,
     *     origin_lng?: float|null,
     *     destination_lat?: float|null,
     *     destination_lng?: float|null,
     *     distance_km?: float|null,
     *     avg_speed_kmph?: float|null
     * }  $params
     * @return array{
     *     source: string,
     *     destination: string,
     *     distance_km: float,
     *     duration_hours: float,
     *     provider: string
     * }
     */
    public function estimateRoute(array $params): array;
}
