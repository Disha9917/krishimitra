<?php

declare(strict_types=1);

namespace App\Services\Equipment;

use App\Models\Equipment;
use App\Models\EquipmentBooking;
use Illuminate\Database\Eloquent\Collection;

interface EquipmentServiceInterface
{
    /**
     * @param  array<string, mixed>  $filters
     * @return Collection<int, Equipment>
     */
    public function listEquipment(array $filters, int $limit): Collection;

    public function findEquipment(int $equipmentId): ?Equipment;

    /**
     * @param  array<string, mixed>  $data
     * @throws \DomainException when the owner has no valid uploads
     */
    public function createListing(int $ownerId, array $data): Equipment;

    /**
     * @param  array<string, mixed>  $data
     * @throws \DomainException when the listing does not belong to the owner
     */
    public function updateListing(int $ownerId, int $equipmentId, array $data): Equipment;

    /**
     * Soft delete a listing, enforcing ownership and active-booking safety.
     *
     * @throws \DomainException when the listing does not belong to the owner
     * @throws \DomainException when the listing has active bookings
     */
    public function deleteListing(int $ownerId, int $equipmentId): bool;

    /**
     * @return Collection<int, Equipment>
     */
    public function myListings(int $ownerId): Collection;

    /**
     * Owner-facing dashboard statistics.
     *
     * @return array<string, mixed>
     */
    public function dashboard(int $userId): array;

    /**
     * Create a booking request against an available listing.
     *
     * @param  array<string, mixed>  $data
     * @throws \DomainException when the equipment is missing/unavailable
     * @throws \DomainException when the renter owns the equipment
     * @throws \DomainException when the dates overlap an existing booking
     */
    public function requestBooking(int $userId, int $equipmentId, array $data): EquipmentBooking;

    /**
     * Owner accepts a pending booking request.
     *
     * @throws \DomainException when the booking is not on the owner's equipment
     * @throws \DomainException when the booking is not in requested status
     */
    public function acceptBooking(int $userId, int $bookingId): EquipmentBooking;

    /**
     * Owner rejects a pending booking request.
     *
     * @param  string|null  $reason
     * @throws \DomainException when the booking is not on the owner's equipment
     * @throws \DomainException when the booking is not in requested status
     */
    public function rejectBooking(int $userId, int $bookingId, ?string $reason = null): EquipmentBooking;

    /**
     * Renter or owner cancels an open booking.
     *
     * @throws \DomainException when the user is neither renter nor owner
     * @throws \DomainException when the booking can no longer be cancelled
     */
    public function cancelBooking(int $userId, int $bookingId, ?string $reason = null): EquipmentBooking;

    /**
     * Owner marks a booking as completed.
     *
     * @throws \DomainException when the booking is not on the owner's equipment
     * @throws \DomainException when the booking is not accepted or in progress
     */
    public function completeBooking(int $userId, int $bookingId): EquipmentBooking;

    /**
     * Bookings placed by the user as a renter.
     *
     * @param  array<string, mixed>  $filters
     * @return Collection<int, EquipmentBooking>
     */
    public function myBookings(int $userId, array $filters, int $limit): Collection;

    /**
     * Bookings received on the user's equipment.
     *
     * @param  array<string, mixed>  $filters
     * @return Collection<int, EquipmentBooking>
     */
    public function ownerBookings(int $userId, array $filters, int $limit): Collection;

    /**
     * Resolve a booking visible to the user (as renter or equipment owner).
     */
    public function findBooking(int $userId, int $bookingId): ?EquipmentBooking;
}
