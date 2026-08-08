<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin array{statistics: array<string, mixed>, recent_bookings: \Illuminate\Database\Eloquent\Collection}
 */
class TransportDashboardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $stats = $this['statistics'];

        return [
            'statistics' => [
                'totalVehicles' => $stats['total_vehicles'],
                'availableVehicles' => $stats['available_vehicles'],
                'totalCapacityKg' => $stats['total_capacity_kg'],
                'activeTrips' => $stats['active_trips'],
                'pendingRequests' => $stats['pending_requests'],
                'revenueSummary' => [
                    'totalRevenue' => $stats['revenue_total'],
                ],
                'bookingStatistics' => [
                    'requested' => $stats['bookings_by_status']['requested'],
                    'approved' => $stats['bookings_by_status']['approved'],
                    'rejected' => $stats['bookings_by_status']['rejected'],
                    'completed' => $stats['bookings_by_status']['completed'],
                    'cancelled' => $stats['bookings_by_status']['cancelled'],
                ],
                'myBookingsCount' => $stats['my_bookings_count'],
            ],
            'recentBookings' => TransportBookingResource::collection($this['recent_bookings']),
        ];
    }
}
