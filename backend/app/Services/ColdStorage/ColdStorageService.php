<?php

declare(strict_types=1);

namespace App\Services\ColdStorage;

use App\Models\ColdStorage;
use App\Models\ColdStorageBooking;
use App\Models\UploadedFile;
use App\Repositories\Contracts\ColdStorageBookingRepositoryInterface;
use App\Repositories\Contracts\ColdStorageRepositoryInterface;
use App\Repositories\Contracts\UploadedFileRepositoryInterface;
use App\Services\ColdStorage\Monitoring\ColdStorageIoTInterface;
use App\Services\ColdStorage\Payments\ColdStoragePaymentGatewayInterface;
use Carbon\Carbon;
use DomainException;
use Illuminate\Database\Eloquent\Collection;

class ColdStorageService implements ColdStorageServiceInterface
{
    private const STATUS_REQUESTED = 'requested';

    private const STATUS_APPROVED = 'approved';

    private const STATUS_REJECTED = 'rejected';

    private const STATUS_CANCELLED = 'cancelled';

    private const STATUS_COMPLETED = 'completed';

    /**
     * Statuses that hold reserved capacity.
     *
     * @var list<string>
     */
    private const RESERVED_STATUSES = ['requested', 'approved'];

    public function __construct(
        private readonly ColdStorageRepositoryInterface $storages,
        private readonly ColdStorageBookingRepositoryInterface $bookings,
        private readonly UploadedFileRepositoryInterface $files,
        private readonly ColdStoragePaymentGatewayInterface $payments,
        private readonly ColdStorageIoTInterface $iot,
    ) {
    }

    public function listStorages(array $filters, int $limit): Collection
    {
        return $this->storages->searchStorage($filters, $limit);
    }

    public function findStorage(int $storageId): ?ColdStorage
    {
        return $this->storages->findById($storageId);
    }

    public function createStorage(int $ownerId, array $data): ColdStorage
    {
        return $this->storages->create([
            'owner_id' => $ownerId,
            ...$this->sanitizeStorageData($ownerId, $data),
        ]);
    }

    public function updateStorage(int $ownerId, int $storageId, array $data): ColdStorage
    {
        $storage = $this->assertStorageOwnership($ownerId, $storageId);

        $this->storages->update((int) $storage->id, $this->sanitizeStorageData($ownerId, $data, $storage));

        return $this->findStorage($storageId);
    }

    public function deleteStorage(int $ownerId, int $storageId): bool
    {
        $storage = $this->assertStorageOwnership($ownerId, $storageId);

        if ($this->bookings->activeBookingsForStorage((int) $storage->id)->isNotEmpty()) {
            throw new DomainException('This cold storage has active bookings and cannot be deleted.');
        }

        return $this->storages->delete((int) $storage->id);
    }

    public function myStorages(int $ownerId): Collection
    {
        return $this->storages->storagesForOwner($ownerId);
    }

    public function dashboard(int $userId): array
    {
        $capacity = $this->storages->capacityStatsForOwner($userId);
        $bookingStats = $this->bookings->statsForOwner($userId);

        $occupancyRate = $capacity['capacity_tonnes'] > 0
            ? round(($capacity['occupied_tonnes'] / $capacity['capacity_tonnes']) * 100, 2)
            : 0.0;

        return [
            'statistics' => [
                'total_storages' => $capacity['total'],
                'capacity_tonnes' => $capacity['capacity_tonnes'],
                'occupied_tonnes' => $capacity['occupied_tonnes'],
                'available_tonnes' => round($capacity['capacity_tonnes'] - $capacity['occupied_tonnes'], 2),
                'occupancy_rate' => $occupancyRate,
                'active_bookings' => $bookingStats['active_count'],
                'pending_requests' => $bookingStats['pending_count'],
                'revenue_total' => $bookingStats['revenue_total'],
                'bookings_by_status' => $bookingStats['counts'],
                'my_bookings_count' => $this->bookings->countForUser($userId),
            ],
            'recent_bookings' => $this->bookings->recentBookings($userId, 5),
        ];
    }

    public function monitorStorage(int $storageId): array
    {
        $storage = $this->storages->findById($storageId);

        if ($storage === null) {
            throw new DomainException(sprintf('Cold storage [%d] does not exist.', $storageId));
        }

        return [
            'storage' => $storage,
            'telemetry' => $this->iot->readings($storage),
        ];
    }

    public function requestBooking(int $userId, int $storageId, array $data): ColdStorageBooking
    {
        $storage = $this->assertBookable($userId, $storageId);

        $startDate = Carbon::parse($data['start_date'])->toDateString();
        $endDate = Carbon::parse($data['end_date'])->toDateString();
        $quantityKg = (float) $data['quantity_kg'];

        $this->assertBookingWindow($data['start_date'], $data['end_date'], $quantityKg);

        $reservedKg = $this->bookings->reservedTonnesForPeriod($storageId, $startDate, $endDate);
        $availableKg = $this->availableKg($storage, $reservedKg);

        if ($quantityKg > $availableKg) {
            throw new DomainException(sprintf(
                'Requested quantity exceeds available capacity (%.2f kg available).',
                $availableKg,
            ));
        }

        $totalAmount = $this->computeTotalAmount($storage, $data['start_date'], $data['end_date'], $quantityKg);

        $booking = $this->bookings->create([
            'user_id' => $userId,
            'cold_storage_id' => $storageId,
            'crop_id' => $data['crop_id'] ?? null,
            'quantity_kg' => $quantityKg,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_amount' => $totalAmount,
            'status' => self::STATUS_REQUESTED,
            'payment_status' => 'unpaid',
        ]);

        $payment = $this->payments->process($booking, $data);

        $this->bookings->update((int) $booking->id, [
            'payment_status' => $payment['status'],
            'payment_method' => $payment['method'],
            'transaction_reference' => $payment['transaction_reference'],
        ]);

        return $this->bookings->findById((int) $booking->id) ?? $booking;
    }

    public function approveBooking(int $userId, int $bookingId): ColdStorageBooking
    {
        $booking = $this->assertOwnerBooking($userId, $bookingId);

        if ($booking->status !== self::STATUS_REQUESTED) {
            throw new DomainException('Only requested bookings can be approved.');
        }

        $storage = $this->storages->findById((int) $booking->cold_storage_id);

        if ($storage === null) {
            throw new DomainException(sprintf('Cold storage [%d] does not exist.', (int) $booking->cold_storage_id));
        }

        $reservedKg = $this->bookings->reservedTonnesForPeriod(
            (int) $storage->id,
            $booking->start_date->toDateString(),
            $booking->end_date->toDateString(),
            (int) $booking->id,
        );

        $availableKg = $this->availableKg($storage, $reservedKg);

        if ((float) $booking->quantity_kg > $availableKg) {
            throw new DomainException('Capacity has been taken by another booking. Reject this request instead.');
        }

        $this->bookings->update((int) $booking->id, [
            'status' => self::STATUS_APPROVED,
            'decided_at' => now(),
        ]);

        $this->adjustOccupied((int) $storage->id, (float) $booking->quantity_kg, +1);

        return $this->findBooking($userId, $bookingId) ?? $booking;
    }

    public function rejectBooking(int $userId, int $bookingId, ?string $reason = null): ColdStorageBooking
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

    public function cancelBooking(int $userId, int $bookingId, ?string $reason = null): ColdStorageBooking
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

        if (!in_array($booking->status, [self::STATUS_REQUESTED, self::STATUS_APPROVED], true)) {
            throw new DomainException('Only open bookings can be cancelled.');
        }

        $wasApproved = $booking->status === self::STATUS_APPROVED;

        $this->bookings->update((int) $booking->id, [
            'status' => self::STATUS_CANCELLED,
            'reason' => $reason,
        ]);

        if ($wasApproved) {
            $this->adjustOccupied((int) $booking->cold_storage_id, (float) $booking->quantity_kg, -1);
        }

        return $this->findBooking($userId, $bookingId) ?? $booking;
    }

    public function completeBooking(int $userId, int $bookingId): ColdStorageBooking
    {
        $booking = $this->assertOwnerBooking($userId, $bookingId);

        if (!in_array($booking->status, [self::STATUS_APPROVED, 'active'], true)) {
            throw new DomainException('Only approved bookings can be completed.');
        }

        $this->bookings->update((int) $booking->id, [
            'status' => self::STATUS_COMPLETED,
            'completed_at' => now(),
        ]);

        $this->adjustOccupied((int) $booking->cold_storage_id, (float) $booking->quantity_kg, -1);

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

    public function findBooking(int $userId, int $bookingId): ?ColdStorageBooking
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
    private function sanitizeStorageData(int $ownerId, array $data, ?ColdStorage $current = null): array
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
            'description' => $value('description'),
            'contact_phone' => $value('contact_phone'),
            'pincode' => $value('pincode'),
            'district_id' => $value('district_id'),
            'taluka_id' => $value('taluka_id'),
            'village_id' => $value('village_id'),
            'lat' => $value('lat'),
            'lng' => $value('lng'),
            'capacity_tonnes' => $value('capacity_tonnes'),
            'occupied_tonnes' => $value('occupied_tonnes', 0),
            'temp_range_c' => $value('temp_range_c'),
            'min_temp_c' => $value('min_temp_c'),
            'max_temp_c' => $value('max_temp_c'),
            'humidity_range' => $value('humidity_range'),
            'supported_crops' => $value('supported_crops'),
            'image_file_id' => $value('image_file_id'),
            'images_json' => $imageIds,
            'rate_per_tonne_month' => $value('rate_per_tonne_month'),
            'is_active' => (bool) $value('is_active', true),
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

        return $this->files->findWhere(['user_id' => $userId])
            ->whereIn('id', $ids)
            ->map(fn (UploadedFile $file): int => (int) $file->id)
            ->values()
            ->all();
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

    private function assertBookable(int $userId, int $storageId): ColdStorage
    {
        $storage = $this->storages->findById($storageId);

        if ($storage === null || ! (bool) $storage->is_active) {
            throw new DomainException(sprintf('Cold storage [%d] is not available.', $storageId));
        }

        if ((int) $storage->owner_id === $userId) {
            throw new DomainException('You cannot book your own cold storage facility.');
        }

        return $storage;
    }

    private function assertBookingWindow(mixed $startDate, mixed $endDate, float $quantityKg): void
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        if ($start->isPast() && ! $start->isToday()) {
            throw new DomainException('Booking start date must not be in the past.');
        }

        if ($end->lt($start)) {
            throw new DomainException('Booking end date must be after the start date.');
        }

        if ($quantityKg <= 0) {
            throw new DomainException('Quantity must be greater than zero.');
        }
    }

    private function assertOwnerBooking(int $userId, int $bookingId): ColdStorageBooking
    {
        $booking = $this->bookings->findBookingForOwner($bookingId, $userId);

        if ($booking === null) {
            throw new DomainException(sprintf('Booking [%d] does not exist on your facility.', $bookingId));
        }

        return $booking;
    }

    private function computeTotalAmount(ColdStorage $storage, mixed $startDate, mixed $endDate, float $quantityKg): float
    {
        $tonnes = $quantityKg / 1000;
        $days = max(1, Carbon::parse($startDate)->diffInDays(Carbon::parse($endDate)) + 1);
        $months = max(1, (int) ceil($days / 30));
        $rate = (float) ($storage->rate_per_tonne_month ?? 0);

        return round($tonnes * $rate * $months, 2);
    }

    /**
     * Total kg that can still be booked for the period.
     */
    private function availableKg(ColdStorage $storage, float $reservedKg): float
    {
        return ((float) $storage->capacity_tonnes * 1000) - ((float) $storage->occupied_tonnes * 1000) - $reservedKg;
    }

    /**
     * Adjust the reserved (occupied) tonnes without ever going negative.
     */
    private function adjustOccupied(int $storageId, float $quantityKg, int $direction): void
    {
        $storage = $this->storages->findById($storageId);

        if ($storage === null) {
            return;
        }

        $deltaTonnes = ($quantityKg / 1000) * $direction;
        $occupied = max(0.0, (float) $storage->occupied_tonnes + $deltaTonnes);

        $this->storages->update($storageId, ['occupied_tonnes' => $occupied]);
    }
}
