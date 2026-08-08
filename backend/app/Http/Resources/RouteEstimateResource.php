<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin array{source: string, destination: string, distance_km: float, duration_hours: float, provider: string}
 */
class RouteEstimateResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'source' => $this['source'],
            'destination' => $this['destination'],
            'estimatedDistanceKm' => (float) $this['distance_km'],
            'estimatedDurationHours' => (float) $this['duration_hours'],
            'provider' => $this['provider'],
        ];
    }
}
