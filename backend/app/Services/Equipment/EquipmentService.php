<?php

declare(strict_types=1);

namespace App\Services\Equipment;

use App\Models\Equipment;
use App\Models\EquipmentBooking;
use App\Models\UploadedFile;
use App\Repositories\Contracts\EquipmentBookingRepositoryInterface;
use App\Repositories\Contracts\EquipmentRepositoryInterface;
use App\Repositories\Contracts\UploadedFileRepositoryInterface;
use App\Services\Equipment\Payments\EquipmentPaymentGatewayInterface;
use Carbon\Carbon;
use DomainException;
use Illuminate\Database\Eloquent\Collection;

class EquipmentService implements EquipmentServiceInterface
{
    private const STATUS_REQUESTED = 'requested';

    private const STATUS_ACCEPTED = 'accepted';

    private const STATUS_REJECTED = 'rejected';

    private const STATUS_CANCELLED = 'cancelled';

    private const STATUS_COMPLETED = 'completed';

    /**
     * Statuses that occupy the equipment and block overlapping bookings.
     *
     * @var list<string>
     */
    private const ACTIVE_STATUSES = ['requested', 'accepted', 'in_progress'];

    public function __construct(
        private readonly EquipmentRepositoryInterface $equipment,
        private readonly EquipmentBookingRepositoryInterface $bookings,
        private readonly UploadedFileRepositoryInterface $files,
        private readonly EquipmentPaymentGatewayInterface $payments,
    ) {
    }

    public function listEquipment(array $filters, int $limit): Collection
    {
        return $this->equipment->searchEquipment($filters, $limit);
    }

    public function findEquipment(int $equipmentId): ?Equipment
    {
        return $this->equipment->findById($equipmentId);
    }

    public function createListing(int $ownerId, array $data): Equipment
    {
        return $this->equipment->create([
            'provider_id' => $ownerId,
            ...$this->sanitizeListingData($ownerId, $data),
        ]);
    }

    public function updateListing(int $ownerId, int $equipmentId, array $data): Equipment
    {
        $listing = $this->assertListingOwnership($ownerId, $equipmentId);

        $this->equipment->update((int) $listing->id, $this->sanitizeListingData($ownerId, $data, $listing));

        return $this->findEquipment($equipmentId);
    }

    public function deleteListing(int $ownerId, int $equipmentId): bool
    {
        $listing = $this->assertListingOwnership($ownerId, $equipmentId);

        if ($this->bookings->activeBookingsForEquipment((int) $listing->id)->isNotEmpty()) {
            throw new DomainException('This equipment has active bookings and cannot be deleted.');
        }

        return $this->equipment->delete((int) $listing->id);
    }

    public function myListings(int $ownerId): Collection
    {
        return $this->equipment->equipmentForOwner($ownerId);
    }

    public function dashboard(int $userId): array
    {
        $equipmentStats = $this->equipment->statsForOwner($userId);
        $bookingStats = $this->bookings->statsForOwner($userId);

        return [
            'statistics' => [
                'total_equipment' => $equipmentStats['total'],
                'available_equipment' => $equipmentStats['available'],
                'active_rentals' => $bookingStats['active_count'],
                'pending_requests' => $bookingStats['counts']['requested'],
                'upcoming_bookings' => $bookingStats['upcoming_count'],
                'earnings_total' => $bookingStats['earnings_total'],
                'deposits_total' => $bookingStats['deposits_total'],
                'bookings_by_status' => $bookingStats['counts'],
                'my_bookings_count' => $this->bookings->countForUser($userId),
            ],
            'recent_bookings' => $this->bookings->recentBookings($userId, 5),
        ];
    }

    public function requestBooking(int $userId, int $equipmentId, array $data): EquipmentBooking
    {
        $listing = $this->assertBookable($userId, $equipmentId);

        $startAt = Carbon::parse($data['start_at']);
        $endAt = Carbon::parse($data['end_at']);

        $this->assertBookingWindow($startAt, $endAt);

        if ($this->bookings->overlappingBooking($equipmentId, $startAt->toDateTimeString(), $endAt->toDateTimeString()) !== null) {
            throw new DomainException('The equipment is already booked for the requested period.');
        }

        $totalAmount = $this->computeTotalAmount($listing, $startAt, $endAt);
        $depositAmount = isset($data['deposit_amount'])
            ? (float) $data['deposit_amount']
            : (float) ($listing->deposit_amount ?? 0);

        $booking = $this->bookings->create([
            'user_id' => $userId,
            'equipment_id' => $equipmentId,
            'start_at' => $startAt,
            'end_at' => $endAt,
            'total_amount' => $totalAmount,
            'deposit_amount' => $depositAmount,
            'status' => self::STATUS_REQUESTED,
            'payment_status' => 'unpaid',
            'location' => $data['location'] ?? null,
            'cancelled_at' => null,
        ]);

        $payment = $this->payments->process($booking, $data);

        $this->bookings->update((int) $booking->id, [
            'payment_status' => $payment['status'],
            'payment_method' => $payment['method'],
            'transaction_reference' => $payment['transaction_reference'],
        ]);

        return $this->bookings->findById((int) $booking->id) ?? $booking;
    }

    public function acceptBooking(int $userId, int $bookingId): EquipmentBooking
    {
        $booking = $this->assertOwnerBooking($userId, $bookingId);

        if ($booking->status !== self::STATUS_REQUESTED) {
            throw new DomainException('Only requested bookings can be accepted.');
        }

        $this->bookings->update((int) $booking->id, [
            'status' => self::STATUS_ACCEPTED,
            'decided_at' => now(),
        ]);

        $this->syncAvailability((int) $booking->equipment_id);

        return $this->findBooking($userId, $bookingId) ?? $booking;
    }

    public function rejectBooking(int $userId, int $bookingId, ?string $reason = null): EquipmentBooking
    {
        $booking = $this->assertOwnerBooking($userId, $bookingId);

        if ($booking->status !== self::STATUS_REQUESTED) {
            throw new DomainException('Only requested bookings can be rejected.');
        }

        $this->bookings->update((int) $booking->id, [
            'status' => self::STATUS_REJECTED,
            'reason' => $reason,
            'decided_at' => now(),
        ]);

        return $this->findBooking($userId, $bookingId) ?? $booking;
    }

    public function cancelBooking(int $userId, int $bookingId, ?string $reason = null): EquipmentBooking
    {
        $booking = $this->bookings->findById($bookingId);

        if ($booking === null) {
            throw new DomainException(sprintf('Booking [%d] does not exist.', $bookingId));
        }

        $isRenter = (int) $booking->user_id === $userId;
        $isOwner = $this->bookings->findBookingForOwner($bookingId, $userId) !== null;

        if (!$isRenter && !$isOwner) {
            throw new DomainException('You are not part of this booking.');
        }

        if (!in_array($booking->status, [self::STATUS_REQUESTED, self::STATUS_ACCEPTED], true)) {
            throw new DomainException('Only open bookings can be cancelled.');
        }

        $this->bookings->update((int) $booking->id, [
            'status' => self::STATUS_CANCELLED,
            'reason' => $reason,
            'cancelled_at' => now(),
        ]);

        $this->syncAvailability((int) $booking->equipment_id);

        return $this->findBooking($userId, $bookingId) ?? $booking;
    }

    public function completeBooking(int $userId, int $bookingId): EquipmentBooking
    {
        $booking = $this->assertOwnerBooking($userId, $bookingId);

        if (!in_array($booking->status, [self::STATUS_ACCEPTED, 'in_progress'], true)) {
            throw new DomainException('Only accepted or in-progress bookings can be completed.');
        }

        $this->bookings->update((int) $booking->id, [
            'status' => self::STATUS_COMPLETED,
            'completed_at' => now(),
        ]);

        $this->syncAvailability((int) $booking->equipment_id);

        return $this->findBooking($userId, $bookingId) ?? $booking;
    }

    public function myBookings(int $userId, array $filters, int $limit): Collection
    {
        return $this->bookings->bookingsForUser($userId, $filters, $limit);
    }

    public function ownerBookings(int $userId, array $filters, int $limit): Collection
    {
        return $this->bookings->bookingsForOwner($userId, $filters, $limit);
    }

    public function findBooking(int $userId, int $bookingId): ?EquipmentBooking
    {
        $booking = $this->bookings->findById($bookingId);

        if ($booking === null) {
            return null;
        }

        $isRenter = (int) $booking->user_id === $userId;
        $isOwner = $this->bookings->findBookingForOwner($bookingId, $userId) !== null;

        return $isRenter || $isOwner ? $booking : null;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function sanitizeListingData(int $ownerId, array $data, ?Equipment $current = null): array
    {
        $imageIds = isset($data['image_file_ids'])
            ? $this->ownedImageIds($ownerId, $data['image_file_ids'])
            : array_values(array_map('intval', (array) ($current?->images_json ?? [])));

        $value = function (string $key, mixed $fallback = null) use ($data, $current): mixed {
            if (array_key_exists($key, $data)) {
                return $data[$key];
            }

            if ($current !== null) {
                return $current->getAttribute($key);
            }

            return $fallback;
        };

        return [
            'name' => $value('name'),
            'equipment_type' => $value('equipment_type'),
            'category' => $value('category'),
            'brand' => $value('brand'),
            'model' => $value('model'),
            'description' => $value('description'),
            'hourly_rate' => $value('hourly_rate'),
            'daily_rate' => $value('daily_rate'),
            'deposit_amount' => $value('deposit_amount'),
            'pincode' => $value('pincode'),
            'district_id' => $value('district_id'),
            'taluka_id' => $value('taluka_id'),
            'village_id' => $value('village_id'),
            'lat' => $value('lat'),
            'lng' => $value('lng'),
            'is_available' => (bool) $value('is_available', true),
            'image_file_id' => $value('image_file_id'),
            'images_json' => $imageIds,
        ];
    }

    /**
     * @param  array<int, mixed>  $ids
     * @return list<int>
     */
    private function ownedImageIds(int $userId, array $ids): array
    {
        $ids = array_values(array_unique(array_map('intval', $ids)));

        if ($ids === []) {
            return [];
        }

        return $this->files->findWhere([
            'user_id' => $userId,
        ])
            ->whereIn('id', $ids)
            ->map(fn (UploadedFile $file): int => (int) $file->id)
            ->values()
            ->all();
    }

    private function assertListingOwnership(int $ownerId, int $equipmentId): Equipment
    {
        $listing = $this->equipment->findById($equipmentId);

        if ($listing === null) {
            throw new DomainException(sprintf('Equipment [%d] does not exist.', $equipmentId));
        }

        if ((int) $listing->provider_id !== $ownerId) {
            throw new DomainException('You do not own this equipment listing.');
        }

        return $listing;
    }

    private function assertBookable(int $userId, int $equipmentId): Equipment
    {
        $listing = $this->equipment->findById($equipmentId);

        if ($listing === null || ! (bool) $listing->is_available) {
            throw new DomainException(sprintf('Equipment [%d] is not available for booking.', $equipmentId));
        }

        if ((int) $listing->provider_id === $userId) {
            throw new DomainException('You cannot rent out your own equipment.');
        }

        return $listing;
    }

    private function assertBookingWindow(Carbon $startAt, Carbon $endAt): void
    {
        if ($startAt->isPast()) {
            throw new DomainException('Booking start date must be in the future.');
        }

        if ($endAt <= $startAt) {
            throw new DomainException('Booking end date must be after the start date.');
        }
    }

    private function assertOwnerBooking(int $userId, int $bookingId): EquipmentBooking
    {
        $booking = $this->bookings->findBookingForOwner($bookingId, $userId);

        if ($booking === null) {
            throw new DomainException(sprintf('Booking [%d] does not exist on your equipment.', $bookingId));
        }

        return $booking;
    }

    private function computeTotalAmount(Equipment $listing, Carbon $startAt, Carbon $endAt): float
    {
        $days = max(1, (int) ceil(abs($endAt->diffInHours($startAt)) / 24));
        $dailyRate = (float) ($listing->daily_rate ?? 0);

        return round($days * $dailyRate, 2);
    }

    /**
     * Keep the is_available flag in sync with active bookings on the equipment.
     */
    private function syncAvailability(int $equipmentId): void
    {
        $occupied = $this->bookings->activeBookingsForEquipment($equipmentId)->isNotEmpty();

        $this->equipment->update($equipmentId, ['is_available' => ! $occupied]);
    }
}
