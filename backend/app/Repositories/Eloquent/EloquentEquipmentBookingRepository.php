<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\EquipmentBooking;
use App\Repositories\Contracts\EquipmentBookingRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class EloquentEquipmentBookingRepository extends BaseEloquentRepository implements EquipmentBookingRepositoryInterface
{
    public function __construct(EquipmentBooking $model)
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

    public function bookingsForOwner(int $providerId, array $filters, int $limit): Collection
    {
        return $this->applyFilters(
            $this->model->whereHas('equipment', fn (Builder $query) => $query->where('provider_id', $providerId)),
            $filters,
            $limit,
        );
    }

    public function activeBookingsForEquipment(int $equipmentId): Collection
    {
        return $this->model
            ->where('equipment_id', $equipmentId)
            ->whereIn('status', ['requested', 'accepted', 'in_progress'])
            ->orderBy('start_at')
            ->get();
    }

    public function overlappingBooking(int $equipmentId, string $startAt, string $endAt, ?int $excludeId = null): ?EquipmentBooking
    {
        $query = $this->model
            ->where('equipment_id', $equipmentId)
            ->whereIn('status', ['requested', 'accepted', 'in_progress'])
            ->where('start_at', '<=', $endAt)
            ->where('end_at', '>=', $startAt);

        if ($excludeId !== null) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->first();
    }

    public function findBookingForUser(int $bookingId, int $userId): ?EquipmentBooking
    {
        return $this->model->whereKey($bookingId)->where('user_id', $userId)->first();
    }

    public function countForUser(int $userId): int
    {
        return (int) $this->model->where('user_id', $userId)->count();
    }

    public function findBookingForOwner(int $bookingId, int $providerId): ?EquipmentBooking
    {
        return $this->model
            ->whereKey($bookingId)
            ->whereHas('equipment', fn (Builder $query) => $query->where('provider_id', $providerId))
            ->first();
    }

    public function statsForOwner(int $providerId): array
    {
        $query = $this->model->whereHas('equipment', fn (Builder $q) => $q->where('provider_id', $providerId));

        $counts = [];
        foreach (['requested', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected'] as $status) {
            $counts[$status] = (int) (clone $query)->where('status', $status)->count();
        }

        return [
            'counts' => $counts,
            'active_count' => $counts['requested'] + $counts['accepted'] + $counts['in_progress'],
            'upcoming_count' => (int) (clone $query)
                ->where('status', 'accepted')
                ->where('start_at', '>', now())
                ->count(),
            'earnings_total' => (float) (clone $query)
                ->where('status', 'completed')
                ->sum('total_amount'),
            'deposits_total' => (float) (clone $query)
                ->where('status', 'completed')
                ->sum('deposit_amount'),
        ];
    }

    public function recentBookings(int $userId, int $limit): Collection
    {
        return $this->model
            ->where(function (Builder $query) use ($userId): void {
                $query->where('user_id', $userId)
                    ->orWhereHas('equipment', fn (Builder $q) => $q->where('provider_id', $userId));
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

        if (isset($filters['equipment_id'])) {
            $query->where('equipment_id', $filters['equipment_id']);
        }

        return $query->orderByDesc('id')->limit($limit)->get();
    }
}
