<?php

declare(strict_types=1);

namespace App\Services\Transport\Providers;

use App\Repositories\Contracts\TransportRouteRepositoryInterface;
use DomainException;

/**
 * Rule-based route planner.
 *
 * Priority order:
 *  1. A cached row in transport_routes (origin_key → destination_key).
 *  2. Haversine distance between the provided coordinates, scaled by a road factor.
 *  3. The distance supplied by the caller (e.g. a manual estimate).
 *
 * Duration is derived from distance and the average vehicle speed.
 */
class RuleBasedRoutePlanner implements RoutePlanningProviderInterface
{
    private const EARTH_RADIUS_KM = 6371.0;

    public function __construct(
        private readonly TransportRouteRepositoryInterface $routes,
    ) {
    }

    /**
     * @param  array<string, mixed>  $params
     * @return array{
     *     source: string,
     *     destination: string,
     *     distance_km: float,
     *     duration_hours: float,
     *     provider: string
     * }
     */
    public function estimateRoute(array $params): array
    {
        $origin = (string) $params['origin'];
        $destination = (string) $params['destination'];
        $speed = (float) ($params['avg_speed_kmph'] ?? config('transport.avg_speed_kmph', 40));

        $distance = $this->resolveDistance($params);

        $duration = $speed > 0 ? round($distance / $speed, 2) : 0.0;

        return [
            'source' => $origin,
            'destination' => $destination,
            'distance_km' => round($distance, 2),
            'duration_hours' => $duration,
            'provider' => 'rule-based',
        ];
    }

    /**
     * @param  array<string, mixed>  $params
     */
    private function resolveDistance(array $params): float
    {
        $route = $this->routes->findRoute(
            $this->key((string) $params['origin']),
            $this->key((string) $params['destination']),
        );

        if ($route !== null && $route->distance_km !== null) {
            return (float) $route->distance_km;
        }

        $originLat = isset($params['origin_lat']) ? (float) $params['origin_lat'] : null;
        $originLng = isset($params['origin_lng']) ? (float) $params['origin_lng'] : null;
        $destinationLat = isset($params['destination_lat']) ? (float) $params['destination_lat'] : null;
        $destinationLng = isset($params['destination_lng']) ? (float) $params['destination_lng'] : null;

        if ($originLat !== null && $originLng !== null && $destinationLat !== null && $destinationLng !== null) {
            return $this->haversine($originLat, $originLng, $destinationLat, $destinationLng)
                * (float) config('transport.road_distance_factor', 1.3);
        }

        if (isset($params['distance_km'])) {
            return (float) $params['distance_km'];
        }

        throw new DomainException(
            'Unable to estimate this route. Provide coordinates or a distance estimate.',
        );
    }

    private function key(string $value): string
    {
        $normalized = strtolower(trim(preg_replace('/\s+/', ' ', $value) ?? $value));

        return $normalized !== '' ? $normalized : 'unknown';
    }

    private function haversine(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $latFrom = deg2rad($lat1);
        $latTo = deg2rad($lat2);
        $deltaLat = deg2rad($lat2 - $lat1);
        $deltaLng = deg2rad($lng2 - $lng1);

        $a = sin($deltaLat / 2) ** 2
            + cos($latFrom) * cos($latTo) * sin($deltaLng / 2) ** 2;

        return 2 * self::EARTH_RADIUS_KM * asin(sqrt($a));
    }
}
