<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\TransportBooking;
use App\Repositories\Contracts\TransportBookingRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class EloquentTransportBookingRepository extends BaseEloquentRepository implements TransportBookingRepositoryInterface
{
    public function __construct(TransportBooking $model)
    {
        parent::__construct($model);
    }

    public function bookingsForUser(int $userId, array $filters, int $limit): Collection
    {
        return $this->applyFilters(
            $this->model->where('user_id', $userId),
            $filters,
            $limit,
        );
    }

    public function bookingsForOwner(int $ownerId, array $filters, int $limit): Collection
    {
        return $this->applyFilters(
            $this->model->whereHas('vehicle', fn (Builder $query) => $query->where('owner_id', $ownerId)),
            $filters,
            $limit,
        );
    }

    public function findBookingForUser(int $bookingId, int $userId): ?TransportBooking
    {
        return $this->model->whereKey($bookingId)->where('user_id', $userId)->first();
    }

    public function findBookingForOwner(int $bookingId, int $ownerId): ?TransportBooking
    {
        return $this->model
            ->whereKey($bookingId)
            ->whereHas('vehicle', fn (Builder $query) => $query->where('owner_id', $ownerId))
            ->first();
    }

    public function countForUser(int $userId): int
    {
        return (int) $this->model->where('user_id', $userId)->count();
    }

    public function overlappingBookings(
        int $vehicleId,
        string $pickupAt,
        string $dropoffAt,
        ?int $excludeBookingId = null,
    ): Collection {
        $query = $this->model
            ->where('vehicle_id', $vehicleId)
            ->whereIn('status', ['requested', 'approved'])
            ->where('pickup_at', '<', $dropoffAt)
            ->where('dropoff_at', '>', $pickupAt);

        if ($excludeBookingId !== null) {
            $query->where('id', '!=', $excludeBookingId);
        }

        return $query->orderBy('pickup_at')->get();
    }

    public function activeBookingsForVehicle(int $vehicleId): Collection
    {
        return $this->model
            ->where('vehicle_id', $vehicleId)
            ->whereIn('status', ['requested', 'approved'])
            ->orderBy('pickup_at')
            ->get();
    }

    public function statsForOwner(int $ownerId): array
    {
        $query = $this->model->whereHas('vehicle', fn (Builder $q) => $q->where('owner_id', $ownerId));

        $counts = [];
        foreach (['requested', 'approved', 'rejected', 'completed', 'cancelled'] as $status) {
            $counts[$status] = (int) (clone $query)->where('status', $status)->count();
        }

        return [
            'counts' => $counts,
            'active_trips' => $counts['requested'] + $counts['approved'],
            'pending_count' => $counts['requested'],
            'revenue_total' => (float) (clone $query)
                ->where('status', 'completed')
                ->sum('total_amount'),
        ];
    }

    public function recentBookings(int $userId, int $limit): Collection
    {
        return $this->model
            ->where(function (Builder $query) use ($userId): void {
                $query->where('user_id', $userId)
                    ->orWhereHas('vehicle', fn (Builder $q) => $q->where('owner_id', $userId));
            })
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    private function applyFilters(Builder $query, array $filters, int $limit): Collection
    {
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['vehicle_id'])) {
            $query->where('vehicle_id', $filters['vehicle_id']);
        }

        return $query->orderByDesc('id')->limit($limit)->get();
    }
}
