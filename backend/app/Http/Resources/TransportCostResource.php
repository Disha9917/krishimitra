<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin array{vehicle: \App\Models\Vehicle, cost_breakdown: array<string, float>, fuel_rate_per_litre: float, total_cost: float, estimated_travel_time_hours: float, distance_km: float, quantity_kg: float}
 */
class TransportCostResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $vehicle = $this['vehicle'];

        return [
            'vehicle' => [
                'id' => (int) $vehicle->id,
                'uuid' => $vehicle->uuid,
                'name' => $vehicle->name,
                'vehicleTypeName' => $vehicle->vehicleType?->name,
                'pricePerKm' => (float) $vehicle->price_per_km,
                'capacityKg' => (float) $vehicle->capacity_kg,
            ],
            'input' => [
                'distanceKm' => (float) $this['distance_km'],
                'quantityKg' => (float) $this['quantity_kg'],
                'fuelRatePerLitre' => (float) $this['fuel_rate_per_litre'],
            ],
            'costBreakdown' => [
                'baseCost' => (float) $this['cost_breakdown']['base_cost'],
                'loadingCharges' => (float) $this['cost_breakdown']['loading_charges'],
                'tollCharges' => (float) $this['cost_breakdown']['toll_charges'],
                'fuelCharges' => (float) $this['cost_breakdown']['fuel_charges'],
            ],
            'totalCost' => (float) $this['total_cost'],
            'estimatedTravelTimeHours' => (float) $this['estimated_travel_time_hours'],
        ];
    }
}
