<?php

declare(strict_types=1);

namespace App\Services\ColdStorage;

use App\Models\ColdStorage;
use App\Models\ColdStorageBooking;
use App\Repositories\Contracts\ColdStorageBookingRepositoryInterface;
use App\Repositories\Contracts\ColdStorageRepositoryInterface;
use DomainException;
use Illuminate\Database\Eloquent\Collection;

class ColdStorageService implements ColdStorageServiceInterface
{
    public function __construct(
        private readonly ColdStorageRepositoryInterface $storages,
        private readonly ColdStorageBookingRepositoryInterface $bookings,
    ) {
    }

    public function listAvailable(): Collection
    {
        return $this->storages->availableStorage();
    }

    public function createStorage(int $ownerId, array $data): ColdStorage
    {
        return $this->storages->create([
            'owner_id' => $ownerId,
            ...$data,
        ]);
    }

    public function updateStorage(int $ownerId, int $storageId, array $data): ?ColdStorage
    {
        $storage = $this->assertStorageOwnership($ownerId, $storageId);

        return $this->storages->update((int) $storage->id, $data);
    }

    public function bookStorage(int $userId, int $storageId, array $data): ColdStorageBooking
    {
        $storage = $this->storages->findById($storageId);

        if ($storage === null || !(bool) $storage->is_active) {
            throw new DomainException(sprintf('Cold storage [%d] is not available.', $storageId));
        }

        return $this->bookings->create([
            'user_id' => $userId,
            'cold_storage_id' => $storageId,
            'status' => 'requested',
            'crop_id' => $data['crop_id'] ?? null,
            'quantity_kg' => $data['quantity_kg'] ?? null,
            'start_date' => $data['start_date'] ?? today()->toDateString(),
            'end_date' => $data['end_date'] ?? null,
            'total_amount' => $data['total_amount'] ?? null,
        ]);
    }

    public function myStorages(int $ownerId): Collection
    {
        return $this->storages->findWhere(['owner_id' => $ownerId]);
    }

    public function myBookings(int $userId): Collection
    {
        return $this->bookings->bookingsForUser($userId);
    }

    public function findStorage(int $storageId): ?ColdStorage
    {
        return $this->storages->findById($storageId);
    }

    private function assertStorageOwnership(int $ownerId, int $storageId): ColdStorage
    {
        $storage = $this->storages->findById($storageId);

        if ($storage === null) {
            throw new DomainException(sprintf('Cold storage [%d] does not exist.', $storageId));
        }

        if ((int) $storage->owner_id !== $ownerId) {
            throw new DomainException('You do not own this cold storage facility.');
        }

        return $storage;
    }
}
