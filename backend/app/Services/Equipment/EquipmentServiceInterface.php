<?php

declare(strict_types=1);

namespace App\Services\Equipment;

use App\Models\Equipment;
use App\Models\EquipmentBooking;
use Illuminate\Database\Eloquent\Collection;

interface EquipmentServiceInterface
{
    public function listAvailable(?int $districtId = null): Collection;

    public function createListing(int $providerId, array $data): Equipment;

    /**
     * Update a listing, enforcing provider ownership.
     *
     * @throws \DomainException when the listing belongs to another provider
     */
    public function updateListing(int $providerId, int $equipmentId, array $data): ?Equipment;

    /**
     * Delete a listing, enforcing provider ownership.
     *
     * @throws \DomainException when the listing belongs to another provider
     */
    public function deleteListing(int $providerId, int $equipmentId): bool;

    /**
     * Create a rental booking against an available listing.
     *
     * @throws \DomainException when the listing is unavailable
     */
    public function bookEquipment(int $userId, int $equipmentId, array $data): EquipmentBooking;

    public function myListings(int $providerId): Collection;

    public function myBookings(int $userId): Collection;

    public function findEquipment(int $equipmentId): ?Equipment;
}
