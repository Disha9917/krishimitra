<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin array{statistics: array<string, mixed>, recent_bookings: \Illuminate\Database\Eloquent\Collection}
 */
class ColdStorageDashboardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $stats = $this['statistics'];

        return [
            'statistics' => [
                'totalStorages' => $stats['total_storages'],
                'capacityTonnes' => $stats['capacity_tonnes'],
                'occupiedTonnes' => $stats['occupied_tonnes'],
                'availableTonnes' => $stats['available_tonnes'],
                'occupancyRate' => $stats['occupancy_rate'],
                'activeBookings' => $stats['active_bookings'],
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
            'recentBookings' => ColdStorageBookingResource::collection($this['recent_bookings']),
        ];
    }
}
