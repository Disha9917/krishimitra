<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\ColdStorageBooking;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ColdStorageBooking */
class ColdStorageBookingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'uuid' => $this->uuid,
            'storage' => $this->coldStorage !== null ? [
                'id' => (int) $this->coldStorage->id,
                'uuid' => $this->coldStorage->uuid,
                'name' => $this->coldStorage->name,
                'capacityTonnes' => (float) $this->coldStorage->capacity_tonnes,
                'availableTonnes' => (float) $this->coldStorage->availableCapacity(),
                'pincode' => $this->coldStorage->pincode,
            ] : null,
            'crop' => $this->crop !== null ? [
                'id' => (int) $this->crop->id,
                'code' => $this->crop->code,
                'name' => $this->crop->name,
            ] : null,
            'renter' => $this->user !== null ? [
                'id' => (int) $this->user->id,
                'fullName' => $this->user->full_name,
                'phone' => $this->user->phone,
            ] : null,
            'quantityKg' => $this->quantity_kg !== null ? (float) $this->quantity_kg : null,
            'startDate' => $this->start_date?->toDateString(),
            'endDate' => $this->end_date?->toDateString(),
            'totalAmount' => $this->total_amount !== null ? (float) $this->total_amount : null,
            'status' => $this->status,
            'paymentStatus' => $this->payment_status,
            'paymentMethod' => $this->payment_method,
            'transactionReference' => $this->transaction_reference,
            'reason' => $this->reason,
            'decidedAt' => $this->decided_at?->toIso8601String(),
            'completedAt' => $this->completed_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
