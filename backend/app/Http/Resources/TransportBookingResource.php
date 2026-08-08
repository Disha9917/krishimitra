<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\TransportBooking;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin TransportBooking */
class TransportBookingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'uuid' => $this->uuid,
            'vehicle' => $this->vehicle !== null ? [
                'id' => (int) $this->vehicle->id,
                'uuid' => $this->vehicle->uuid,
                'name' => $this->vehicle->name,
                'vehicleNumber' => $this->vehicle->vehicle_number,
                'capacityKg' => (float) $this->vehicle->capacity_kg,
                'pricePerKm' => (float) $this->vehicle->price_per_km,
                'owner' => $this->vehicle->owner !== null ? [
                    'id' => (int) $this->vehicle->owner->id,
                    'fullName' => $this->vehicle->owner->full_name,
                    'phone' => $this->vehicle->owner->phone,
                ] : null,
            ] : null,
            'vehicleType' => $this->vehicleType !== null ? [
                'id' => (int) $this->vehicleType->id,
                'name' => $this->vehicleType->name,
            ] : null,
            'customer' => $this->user !== null ? [
                'id' => (int) $this->user->id,
                'fullName' => $this->user->full_name,
                'phone' => $this->user->phone,
            ] : null,
            'quantityKg' => $this->quantity_kg !== null ? (float) $this->quantity_kg : null,
            'distanceKm' => $this->distance_km !== null ? (float) $this->distance_km : null,
            'pickupLocation' => $this->pickup_location,
            'dropoffLocation' => $this->dropoff_location,
            'pickupAt' => $this->pickup_at?->toIso8601String(),
            'dropoffAt' => $this->dropoff_at?->toIso8601String(),
            'costBreakdown' => [
                'baseCost' => (float) $this->base_cost,
                'loadingCharges' => (float) $this->loading_charges,
                'tollCharges' => (float) $this->toll_charges,
                'fuelCharges' => (float) $this->fuel_charges,
            ],
            'totalAmount' => $this->total_amount !== null ? (float) $this->total_amount : null,
            'status' => $this->status,
            'paymentStatus' => $this->payment_status,
            'paymentMethod' => $this->payment_method,
            'transactionReference' => $this->transaction_reference,
            'reason' => $this->reason,
            'decidedAt' => $this->decided_at?->toIso8601String(),
            'cancelledAt' => $this->cancelled_at?->toIso8601String(),
            'completedAt' => $this->completed_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
