<?php

declare(strict_types=1);

namespace App\Services\ColdStorage;

use App\Models\ColdStorage;
use App\Models\ColdStorageBooking;
use Illuminate\Database\Eloquent\Collection;

interface ColdStorageServiceInterface
{
    public function listAvailable(): Collection;

    public function createStorage(int $ownerId, array $data): ColdStorage;

    /**
     * Update a storage facility, enforcing owner ownership.
     *
     * @throws \DomainException when the facility belongs to another owner
     */
    public function updateStorage(int $ownerId, int $storageId, array $data): ?ColdStorage;

    /**
     * Create a storage booking against an active facility.
     *
     * @throws \DomainException when the facility is inactive
     */
    public function bookStorage(int $userId, int $storageId, array $data): ColdStorageBooking;

    public function myStorages(int $ownerId): Collection;

    public function myBookings(int $userId): Collection;

    public function findStorage(int $storageId): ?ColdStorage;
}
