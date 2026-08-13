<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\EquipmentBooking;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin EquipmentBooking */
class BookingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'uuid' => $this->uuid,
            'equipment' => $this->equipment !== null ? [
                'id' => (int) $this->equipment->id,
                'uuid' => $this->equipment->uuid,
                'name' => $this->equipment->name,
                'type' => $this->equipment->equipment_type,
                'category' => $this->equipment->category,
                'dailyRate' => $this->equipment->daily_rate !== null ? (float) $this->equipment->daily_rate : null,
                'pincode' => $this->equipment->pincode,
                'isAvailable' => (bool) $this->equipment->is_available,
            ] : null,
            'renter' => $this->user !== null ? [
                'id' => (int) $this->user->id,
                'fullName' => $this->user->full_name,
                'phone' => $this->user->phone,
            ] : null,
            'startAt' => $this->start_at?->toIso8601String(),
            'endAt' => $this->end_at?->toIso8601String(),
            'totalAmount' => $this->total_amount !== null ? (float) $this->total_amount : null,
            'depositAmount' => $this->deposit_amount !== null ? (float) $this->deposit_amount : null,
            'status' => $this->status,
            'paymentStatus' => $this->payment_status,
            'paymentMethod' => $this->payment_method,
            'transactionReference' => $this->transaction_reference,
            'location' => $this->location,
            'reason' => $this->reason,
            'decidedAt' => $this->decided_at?->toIso8601String(),
            'cancelledAt' => $this->cancelled_at?->toIso8601String(),
            'completedAt' => $this->completed_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
