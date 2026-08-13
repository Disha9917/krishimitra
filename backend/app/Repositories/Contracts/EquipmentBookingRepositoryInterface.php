<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\EquipmentBooking;
use Illuminate\Database\Eloquent\Collection;

interface EquipmentBookingRepositoryInterface extends BaseRepositoryInterface
{

    /**
     * @param  array<string, mixed>  $filters
     * @return Collection<int, EquipmentBooking>
     */
    public function bookingsForUser(int $userId, array $filters, int $limit): Collection;

    /**
     * Bookings placed against equipment owned by the given provider.
     *
     * @param  array<string, mixed>  $filters
     * @return Collection<int, EquipmentBooking>
     */
    public function bookingsForOwner(int $providerId, array $filters, int $limit): Collection;

    /**
     * Bookings that currently occupy the equipment (requested/accepted/in_progress).
     *
     * @return Collection<int, EquipmentBooking>
     */
    public function activeBookingsForEquipment(int $equipmentId): Collection;

    /**
     * Find an active booking whose window overlaps the given period.
     */
    public function overlappingBooking(int $equipmentId, string $startAt, string $endAt, ?int $excludeId = null): ?EquipmentBooking;

    public function findBookingForUser(int $bookingId, int $userId): ?EquipmentBooking;

    public function findBookingForOwner(int $bookingId, int $providerId): ?EquipmentBooking;

    /**
     * Total bookings placed by the user as a renter.
     */
    public function countForUser(int $userId): int;

    /**
     * Booking statistics and earnings for the equipment owner.
     *
     * @return array{
     *     counts: array<string, int>,
     *     active_count: int,
     *     upcoming_count: int,
     *     earnings_total: float,
     *     deposits_total: float
     * }
     */
    public function statsForOwner(int $providerId): array;

    /**
     * Latest bookings (from owner's equipment or placed by the user) for dashboards.
     *
     * @return Collection<int, EquipmentBooking>
     */
    public function recentBookings(int $userId, int $limit): Collection;
}
