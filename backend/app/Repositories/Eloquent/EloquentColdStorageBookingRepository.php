<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\ColdStorageBooking;
use App\Repositories\Contracts\ColdStorageBookingRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class EloquentColdStorageBookingRepository extends BaseEloquentRepository implements ColdStorageBookingRepositoryInterface
{
    public function __construct(ColdStorageBooking $model)
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
            $this->model->whereHas('coldStorage', fn (Builder $query) => $query->where('owner_id', $ownerId)),
            $filters,
            $limit,
        );
    }

    public function findBookingForUser(int $bookingId, int $userId): ?ColdStorageBooking
    {
        return $this->model->whereKey($bookingId)->where('user_id', $userId)->first();
    }

    public function countForUser(int $userId): int
    {
        return (int) $this->model->where('user_id', $userId)->count();
    }

    public function findBookingForOwner(int $bookingId, int $ownerId): ?ColdStorageBooking
    {
        return $this->model
            ->whereKey($bookingId)
            ->whereHas('coldStorage', fn (Builder $query) => $query->where('owner_id', $ownerId))
            ->first();
    }

    public function reservedTonnesForPeriod(int $storageId, string $startDate, string $endDate, ?int $excludeBookingId = null): float
    {
        $query = $this->model
            ->where('cold_storage_id', $storageId)
            ->whereIn('status', ['requested', 'approved'])
            ->where('start_date', '<=', $endDate)
            ->where('end_date', '>=', $startDate);

        if ($excludeBookingId !== null) {
            $query->where('id', '!=', $excludeBookingId);
        }

        return (float) $query->sum('quantity_kg');
    }

    public function activeBookingsForStorage(int $storageId): Collection
    {
        return $this->model
            ->where('cold_storage_id', $storageId)
            ->whereIn('status', ['requested', 'approved'])
            ->orderBy('start_date')
            ->get();
    }

    public function statsForOwner(int $ownerId): array
    {
        $query = $this->model->whereHas('coldStorage', fn (Builder $q) => $q->where('owner_id', $ownerId));

        $counts = [];
        foreach (['requested', 'approved', 'rejected', 'completed', 'cancelled'] as $status) {
            $counts[$status] = (int) (clone $query)->where('status', $status)->count();
        }

        return [
            'counts' => $counts,
            'active_count' => $counts['requested'] + $counts['approved'],
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
                    ->orWhereHas('coldStorage', fn (Builder $q) => $q->where('owner_id', $userId));
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

        if (isset($filters['storage_id'])) {
            $query->where('cold_storage_id', $filters['storage_id']);
        }

        return $query->orderByDesc('id')->limit($limit)->get();
    }
}
