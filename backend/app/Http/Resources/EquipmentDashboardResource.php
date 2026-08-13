<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin array{statistics: array<string, mixed>, recent_bookings: \Illuminate\Database\Eloquent\Collection}
 */
class EquipmentDashboardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $stats = $this['statistics'];

        return [
            'statistics' => [
                'totalEquipment' => $stats['total_equipment'],
                'availableEquipment' => $stats['available_equipment'],
                'activeRentals' => $stats['active_rentals'],
                'pendingRequests' => $stats['pending_requests'],
                'upcomingBookings' => $stats['upcoming_bookings'],
                'earningsSummary' => [
                    'totalEarnings' => $stats['earnings_total'],
                    'depositsHeld' => $stats['deposits_total'],
                ],
                'bookingStatistics' => [
                    'requested' => $stats['bookings_by_status']['requested'],
                    'accepted' => $stats['bookings_by_status']['accepted'],
                    'inProgress' => $stats['bookings_by_status']['in_progress'],
                    'completed' => $stats['bookings_by_status']['completed'],
                    'cancelled' => $stats['bookings_by_status']['cancelled'],
                    'rejected' => $stats['bookings_by_status']['rejected'],
                ],
                'myBookingsCount' => $stats['my_bookings_count'],
            ],
            'recentBookings' => BookingResource::collection($this['recent_bookings']),
        ];
    }
}
