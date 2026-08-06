<?php

declare(strict_types=1);

namespace App\Services\Equipment;

use App\Models\Equipment;
use App\Models\EquipmentBooking;
use App\Repositories\Contracts\EquipmentBookingRepositoryInterface;
use App\Repositories\Contracts\EquipmentRepositoryInterface;
use DomainException;
use Illuminate\Database\Eloquent\Collection;

class EquipmentService implements EquipmentServiceInterface
{
    public function __construct(
        private readonly EquipmentRepositoryInterface $equipment,
        private readonly EquipmentBookingRepositoryInterface $bookings,
    ) {
    }

    public function listAvailable(?int $districtId = null): Collection
    {
        $listings = $this->equipment->availableEquipment();

        if ($districtId === null) {
            return $listings;
        }

        return $listings
            ->filter(fn (Equipment $listing): bool => (int) $listing->district_id === $districtId)
            ->values();
    }

    public function createListing(int $providerId, array $data): Equipment
    {
        return $this->equipment->create([
            'provider_id' => $providerId,
            ...$data,
        ]);
    }

    public function updateListing(int $providerId, int $equipmentId, array $data): ?Equipment
    {
        $listing = $this->assertListingOwnership($providerId, $equipmentId);

        return $this->equipment->update((int) $listing->id, $data);
    }

    public function deleteListing(int $providerId, int $equipmentId): bool
    {
        $listing = $this->assertListingOwnership($providerId, $equipmentId);

        return $this->equipment->delete((int) $listing->id);
    }

    public function bookEquipment(int $userId, int $equipmentId, array $data): EquipmentBooking
    {
        $listing = $this->equipment->findById($equipmentId);

        if ($listing === null || !(bool) $listing->is_available) {
            throw new DomainException(sprintf('Equipment [%d] is not available for booking.', $equipmentId));
        }

        return $this->bookings->create([
            'user_id' => $userId,
            'equipment_id' => $equipmentId,
            'status' => 'requested',
            'total_amount' => $this->computeBookingAmount($listing, $data),
            'location' => $data['location'] ?? null,
            'start_at' => $data['start_at'] ?? now(),
            'end_at' => $data['end_at'] ?? null,
            'cancelled_at' => null,
        ]);
    }

    public function myListings(int $providerId): Collection
    {
        return $this->equipment->findWhere(['provider_id' => $providerId]);
    }

    public function myBookings(int $userId): Collection
    {
        return $this->bookings->bookingsForUser($userId);
    }

    public function findEquipment(int $equipmentId): ?Equipment
    {
        return $this->equipment->findById($equipmentId);
    }

    private function assertListingOwnership(int $providerId, int $equipmentId): Equipment
    {
        $listing = $this->equipment->findById($equipmentId);

        if ($listing === null) {
            throw new DomainException(sprintf('Equipment [%d] does not exist.', $equipmentId));
        }

        if ((int) $listing->provider_id !== $providerId) {
            throw new DomainException('You do not own this equipment listing.');
        }

        return $listing;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function computeBookingAmount(Equipment $listing, array $data): ?float
    {
        $startAt = isset($data['start_at']) ? \Carbon\Carbon::parse($data['start_at']) : now();
        $endAt = isset($data['end_at']) ? \Carbon\Carbon::parse($data['end_at']) : null;

        if ($endAt === null || !$endAt->isAfter($startAt)) {
            return null;
        }

        $hours = (float) $endAt->diffInHours($startAt);

        if ($hours <= 0.0) {
            return null;
        }

        $hourlyRate = (float) ($listing->hourly_rate ?? 0);

        return round($hours * $hourlyRate, 2);
    }
}
