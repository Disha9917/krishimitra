<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\TransportBooking;
use Illuminate\Database\Eloquent\Collection;

interface TransportBookingRepositoryInterface extends BaseRepositoryInterface
{

    /**
     * @param  array<string, mixed>  $filters
     * @return Collection<int, TransportBooking>
     */
    public function bookingsForUser(int $userId, array $filters, int $limit): Collection;

    /**
     * Bookings placed against vehicles owned by the given owner.
     *
     * @param  array<string, mixed>  $filters
     * @return Collection<int, TransportBooking>
     */
    public function bookingsForOwner(int $ownerId, array $filters, int $limit): Collection;

    public function findBookingForUser(int $bookingId, int $userId): ?TransportBooking;

    public function findBookingForOwner(int $bookingId, int $ownerId): ?TransportBooking;

    /**
     * Total bookings placed by the user as a customer.
     */
    public function countForUser(int $userId): int;

    /**
     * Bookings that hold the vehicle for an overlapping time window.
     *
     * @return Collection<int, TransportBooking>
     */
    public function overlappingBookings(
        int $vehicleId,
        string $pickupAt,
        string $dropoffAt,
        ?int $excludeBookingId = null,
    ): Collection;

    /**
     * Open bookings (requested/approved) for a vehicle — used to guard deletion.
     *
     * @return Collection<int, TransportBooking>
     */
    public function activeBookingsForVehicle(int $vehicleId): Collection;

    /**
     * Booking statistics and revenue for the vehicle owner.
     *
     * @return array{
     *     counts: array<string, int>,
     *     active_trips: int,
     *     pending_count: int,
     *     revenue_total: float
     * }
     */
    public function statsForOwner(int $ownerId): array;

    /**
     * @return Collection<int, TransportBooking>
     */
    public function recentBookings(int $userId, int $limit): Collection;
}
