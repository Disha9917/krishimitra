<?php

declare(strict_types=1);

namespace App\Services\ColdStorage;

use App\Models\ColdStorage;
use App\Models\ColdStorageBooking;
use Illuminate\Database\Eloquent\Collection;

interface ColdStorageServiceInterface
{
    /**
     * @param  array<string, mixed>  $filters
     * @return Collection<int, ColdStorage>
     */
    public function listStorages(array $filters, int $limit): Collection;

    public function findStorage(int $storageId): ?ColdStorage;

    /**
     * @param  array<string, mixed>  $data
     */
    public function createStorage(int $ownerId, array $data): ColdStorage;

    /**
     * @param  array<string, mixed>  $data
     * @throws \DomainException when the facility does not belong to the owner
     */
    public function updateStorage(int $ownerId, int $storageId, array $data): ColdStorage;

    /**
     * Soft delete a facility, enforcing ownership and active-booking safety.
     *
     * @throws \DomainException when the facility does not belong to the owner
     * @throws \DomainException when the facility has active bookings
     */
    public function deleteStorage(int $ownerId, int $storageId): bool;

    /**
     * @return Collection<int, ColdStorage>
     */
    public function myStorages(int $ownerId): Collection;

    /**
     * Owner-facing dashboard statistics.
     *
     * @return array<string, mixed>
     */
    public function dashboard(int $userId): array;

    /**
     * Live telemetry merged with facility readings.
     *
     * @return array<string, mixed>
     */
    public function monitorStorage(int $storageId): array;

    /**
     * Request capacity for a period.
     *
     * @param  array<string, mixed>  $data
     * @throws \DomainException when the facility is missing/inactive
     * @throws \DomainException when the requester owns the facility
     * @throws \DomainException when capacity would be exceeded
     */
    public function requestBooking(int $userId, int $storageId, array $data): ColdStorageBooking;

    /**
     * Owner approves a booking request and reserves its capacity.
     *
     * @throws \DomainException when the booking is not on the owner's facility
     * @throws \DomainException when the booking is not requested
     */
    public function approveBooking(int $userId, int $bookingId): ColdStorageBooking;

    /**
     * Owner rejects a pending booking request.
     *
     * @throws \DomainException when the booking is not on the owner's facility
     * @throws \DomainException when the booking is not requested
     */
    public function rejectBooking(int $userId, int $bookingId, ?string $reason = null): ColdStorageBooking;

    /**
     * Renter or owner cancels an open booking and releases capacity.
     *
     * @throws \DomainException when the user is neither renter nor owner
     * @throws \DomainException when the booking can no longer be cancelled
     */
    public function cancelBooking(int $userId, int $bookingId, ?string $reason = null): ColdStorageBooking;

    /**
     * Owner marks a booking as completed and releases capacity.
     *
     * @throws \DomainException when the booking is not on the owner's facility
     * @throws \DomainException when the booking is not approved
     */
    public function completeBooking(int $userId, int $bookingId): ColdStorageBooking;

    /**
     * @param  array<string, mixed>  $filters
     * @return Collection<int, ColdStorageBooking>
     */
    public function myBookings(int $userId, array $filters, int $limit): Collection;

    /**
     * @param  array<string, mixed>  $filters
     * @return Collection<int, ColdStorageBooking>
     */
    public function ownerBookings(int $userId, array $filters, int $limit): Collection;

    public function findBooking(int $userId, int $bookingId): ?ColdStorageBooking;
}
