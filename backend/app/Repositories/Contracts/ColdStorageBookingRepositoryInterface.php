<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\ColdStorageBooking;
use Illuminate\Database\Eloquent\Collection;

interface ColdStorageBookingRepositoryInterface extends BaseRepositoryInterface
{

    /**
     * @param  array<string, mixed>  $filters
     * @return Collection<int, ColdStorageBooking>
     */
    public function bookingsForUser(int $userId, array $filters, int $limit): Collection;

    /**
     * Bookings placed against facilities owned by the given owner.
     *
     * @param  array<string, mixed>  $filters
     * @return Collection<int, ColdStorageBooking>
     */
    public function bookingsForOwner(int $ownerId, array $filters, int $limit): Collection;

    public function findBookingForUser(int $bookingId, int $userId): ?ColdStorageBooking;

    public function findBookingForOwner(int $bookingId, int $ownerId): ?ColdStorageBooking;

    /**
     * Total bookings placed by the user as a renter.
     */
    public function countForUser(int $userId): int;

    /**
     * Total reserved tonnes (requested + approved) overlapping the given period.
     */
    public function reservedTonnesForPeriod(int $storageId, string $startDate, string $endDate, ?int $excludeBookingId = null): float;

    /**
     * @return Collection<int, ColdStorageBooking>
     */
    public function activeBookingsForStorage(int $storageId): Collection;

    /**
     * Booking statistics and revenue for the facility owner.
     *
     * @return array{
     *     counts: array<string, int>,
     *     active_count: int,
     *     pending_count: int,
     *     revenue_total: float
     * }
     */
    public function statsForOwner(int $ownerId): array;

    /**
     * @return Collection<int, ColdStorageBooking>
     */
    public function recentBookings(int $userId, int $limit): Collection;
}
