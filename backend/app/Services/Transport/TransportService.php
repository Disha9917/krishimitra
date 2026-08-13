<?php

declare(strict_types=1);

namespace App\Services\Transport;

use App\Models\TransportBooking;
use App\Models\TransportRoute;
use App\Models\TransportVehicleType;
use App\Models\UploadedFile;
use App\Models\Vehicle;
use App\Repositories\Contracts\TransportBookingRepositoryInterface;
use App\Repositories\Contracts\TransportCalculationRepositoryInterface;
use App\Repositories\Contracts\TransportRouteRepositoryInterface;
use App\Repositories\Contracts\TransportVehicleTypeRepositoryInterface;
use App\Repositories\Contracts\UploadedFileRepositoryInterface;
use App\Repositories\Contracts\VehicleRepositoryInterface;
use App\Services\Common\DTO\TransportQuoteDTO;
use App\Services\Transport\Payments\TransportPaymentGatewayInterface;
use App\Services\Transport\Providers\RoutePlanningProviderInterface;
use Carbon\Carbon;
use DomainException;
use Illuminate\Database\Eloquent\Collection;

class TransportService implements TransportServiceInterface
{
    private const QUINTAL_KG = 100.0;

    private const STATUS_REQUESTED = 'requested';

    private const STATUS_APPROVED = 'approved';

    private const STATUS_REJECTED = 'rejected';

    private const STATUS_CANCELLED = 'cancelled';

    private const STATUS_COMPLETED = 'completed';

    /**
     * Statuses that hold the vehicle for their time window.
     *
     * @var list<string>
     */
    private const HELD_STATUSES = ['requested', 'approved'];

    public function __construct(
        private readonly TransportCalculationRepositoryInterface $calculations,
        private readonly TransportRouteRepositoryInterface $routes,
        private readonly TransportVehicleTypeRepositoryInterface $vehicleTypes,
        private readonly VehicleRepositoryInterface $vehicles,
        private readonly TransportBookingRepositoryInterface $bookings,
        private readonly UploadedFileRepositoryInterface $files,
        private readonly TransportPaymentGatewayInterface $payments,
        private readonly RoutePlanningProviderInterface $routePlanner,
    ) {
    }

    public function calculateTransport(
        int $userId,
        string $origin,
        string $destination,
        float $quantityKg,
        ?float $distanceKm = null,
        ?int $vehicleTypeId = null,
    ): TransportQuoteDTO {
        $route = $this->routes->findRoute($origin, $destination);

        $distance = $distanceKm ?? ($route?->distance_km !== null ? (float) $route->distance_km : null);
        $transitHours = $route?->duration_hours !== null ? (float) $route->duration_hours : null;

        $types = $this->vehicleTypes->activeTypes();
        $vehicle = $vehicleTypeId !== null
            ? $types->firstWhere('id', $vehicleTypeId)
            : $this->selectFittingVehicle($types, $quantityKg);

        if ($vehicle === null) {
            throw new DomainException('No vehicle type can carry the given load.');
        }

        $transportCost = null;

        if ($distance !== null) {
            $ratePerKmPerQuintal = (float) ($vehicle->rate_per_km_per_qtl ?? 0);
            $transportCost = round($ratePerKmPerQuintal * $distance * ($quantityKg / self::QUINTAL_KG), 2);
        }

        $calculation = $this->calculations->create([
            'user_id' => $userId,
            'origin' => $origin,
            'destination' => $destination,
            'quantity_kg' => $quantityKg,
            'transport_type_id' => (int) $vehicle->id,
            'distance_km' => $distance,
            'transport_cost' => $transportCost,
            'estimated_price_at_destination' => null,
            'gross_revenue' => null,
            'net_profit' => null,
            'profit_margin_pct' => null,
            'transit_hours' => $transitHours,
        ]);

        return TransportQuoteDTO::fromModel($calculation);
    }

    public function findRoute(string $originKey, string $destinationKey): ?TransportRoute
    {
        return $this->routes->findRoute($originKey, $destinationKey);
    }

    public function vehicleTypes(): Collection
    {
        return $this->vehicleTypes->activeTypes();
    }

    public function calculationsForUser(int $userId): Collection
    {
        return $this->calculations->calculationsForUser($userId);
    }

    public function listVehicles(array $filters, int $limit): Collection
    {
        return $this->vehicles->searchVehicles($filters, $limit);
    }

    public function findVehicle(int $vehicleId): ?Vehicle
    {
        return $this->vehicles->findById($vehicleId);
    }

    public function createVehicle(int $ownerId, array $data): Vehicle
    {
        return $this->vehicles->create([
            'owner_id' => $ownerId,
            ...$this->sanitizeVehicleData($ownerId, $data),
        ]);
    }

    public function updateVehicle(int $ownerId, int $vehicleId, array $data): Vehicle
    {
        $vehicle = $this->assertVehicleOwnership($ownerId, $vehicleId);

        $this->vehicles->update((int) $vehicle->id, $this->sanitizeVehicleData($ownerId, $data, $vehicle));

        return $this->findVehicle($vehicleId);
    }

    public function deleteVehicle(int $ownerId, int $vehicleId): bool
    {
        $vehicle = $this->assertVehicleOwnership($ownerId, $vehicleId);

        if ($this->bookings->activeBookingsForVehicle((int) $vehicle->id)->isNotEmpty()) {
            throw new DomainException('This vehicle has active bookings and cannot be deleted.');
        }

        return $this->vehicles->delete((int) $vehicle->id);
    }

    public function myVehicles(int $ownerId): Collection
    {
        return $this->vehicles->vehiclesForOwner($ownerId);
    }

    public function dashboard(int $userId): array
    {
        $vehicleStats = $this->vehicles->statsForOwner($userId);
        $bookingStats = $this->bookings->statsForOwner($userId);

        return [
            'statistics' => [
                'total_vehicles' => $vehicleStats['total'],
                'available_vehicles' => $vehicleStats['available'],
                'total_capacity_kg' => $vehicleStats['capacity_kg'],
                'active_trips' => $bookingStats['active_trips'],
                'pending_requests' => $bookingStats['pending_count'],
                'revenue_total' => $bookingStats['revenue_total'],
                'bookings_by_status' => $bookingStats['counts'],
                'my_bookings_count' => $this->bookings->countForUser($userId),
            ],
            'recent_bookings' => $this->bookings->recentBookings($userId, 5),
        ];
    }

    public function costEstimate(int $vehicleId, array $data): array
    {
        $vehicle = $this->findVehicle($vehicleId);

        if ($vehicle === null) {
            throw new DomainException(sprintf('Vehicle [%d] does not exist.', $vehicleId));
        }

        return $this->computeCostBreakdown($vehicle, $data);
    }

    public function routeEstimate(array $params): array
    {
        return $this->routePlanner->estimateRoute($params);
    }

    public function requestBooking(int $userId, int $vehicleId, array $data): TransportBooking
    {
        $vehicle = $this->assertBookable($userId, $vehicleId);

        $quantityKg = (float) $data['quantity_kg'];
        $distanceKm = (float) $data['distance_km'];
        $pickupAt = Carbon::parse($data['pickup_at']);
        $dropoffAt = Carbon::parse($data['dropoff_at']);

        $this->assertBookingWindow($pickupAt, $dropoffAt, $quantityKg, (float) $vehicle->capacity_kg);

        if ($this->bookings->overlappingBookings($vehicleId, $pickupAt->toIso8601String(), $dropoffAt->toIso8601String())->isNotEmpty()) {
            throw new DomainException('This vehicle is already booked for an overlapping time window.');
        }

        $breakdown = $this->computeCostBreakdown($vehicle, $data);

        $booking = $this->bookings->create([
            'user_id' => $userId,
            'vehicle_id' => $vehicleId,
            'vehicle_type_id' => (int) $vehicle->vehicle_type_id,
            'quantity_kg' => $quantityKg,
            'distance_km' => $distanceKm,
            'pickup_location' => $data['pickup_location'] ?? null,
            'dropoff_location' => $data['dropoff_location'] ?? null,
            'pickup_at' => $pickupAt,
            'dropoff_at' => $dropoffAt,
            'base_cost' => $breakdown['cost_breakdown']['base_cost'],
            'loading_charges' => $breakdown['cost_breakdown']['loading_charges'],
            'toll_charges' => $breakdown['cost_breakdown']['toll_charges'],
            'fuel_charges' => $breakdown['cost_breakdown']['fuel_charges'],
            'total_amount' => $breakdown['total_cost'],
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

    public function approveBooking(int $userId, int $bookingId): TransportBooking
    {
        $booking = $this->assertOwnerBooking($userId, $bookingId);

        if ($booking->status !== self::STATUS_REQUESTED) {
            throw new DomainException('Only requested bookings can be approved.');
        }

        if ($this->bookings->overlappingBookings(
            (int) $booking->vehicle_id,
            $booking->pickup_at->toIso8601String(),
            $booking->dropoff_at->toIso8601String(),
            (int) $booking->id,
        )->isNotEmpty()) {
            throw new DomainException('This vehicle is no longer free for the requested time window.');
        }

        $this->bookings->update((int) $booking->id, [
            'status' => self::STATUS_APPROVED,
            'decided_at' => now(),
        ]);

        return $this->findBooking($userId, $bookingId) ?? $booking;
    }

    public function rejectBooking(int $userId, int $bookingId, ?string $reason = null): TransportBooking
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

    public function cancelBooking(int $userId, int $bookingId, ?string $reason = null): TransportBooking
    {
        $booking = $this->bookings->findById($bookingId);

        if ($booking === null) {
            throw new DomainException(sprintf('Booking [%d] does not exist.', $bookingId));
        }

        $isCustomer = (int) $booking->user_id === $userId;
        $isOwner = $this->bookings->findBookingForOwner($bookingId, $userId) !== null;

        if (! $isCustomer && ! $isOwner) {
            throw new DomainException('You are not part of this booking.');
        }

        if (! in_array($booking->status, [self::STATUS_REQUESTED, self::STATUS_APPROVED], true)) {
            throw new DomainException('Only open bookings can be cancelled.');
        }

        $this->bookings->update((int) $booking->id, [
            'status' => self::STATUS_CANCELLED,
            'reason' => $reason,
            'cancelled_at' => now(),
        ]);

        return $this->findBooking($userId, $bookingId) ?? $booking;
    }

    public function completeBooking(int $userId, int $bookingId): TransportBooking
    {
        $booking = $this->assertOwnerBooking($userId, $bookingId);

        if ($booking->status !== self::STATUS_APPROVED) {
            throw new DomainException('Only approved bookings can be completed.');
        }

        $this->bookings->update((int) $booking->id, [
            'status' => self::STATUS_COMPLETED,
            'completed_at' => now(),
        ]);

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

    public function findBooking(int $userId, int $bookingId): ?TransportBooking
    {
        $booking = $this->bookings->findById($bookingId);

        if ($booking === null) {
            return null;
        }

        $isCustomer = (int) $booking->user_id === $userId;
        $isOwner = $this->bookings->findBookingForOwner($bookingId, $userId) !== null;

        return $isCustomer || $isOwner ? $booking : null;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array{
     *     vehicle: Vehicle,
     *     cost_breakdown: array{base_cost: float, loading_charges: float, toll_charges: float, fuel_charges: float},
     *     fuel_rate_per_litre: float,
     *     total_cost: float,
     *     estimated_travel_time_hours: float,
     *     distance_km: float,
     *     quantity_kg: float
     * }
     */
    private function computeCostBreakdown(Vehicle $vehicle, array $data): array
    {
        $distanceKm = (float) $data['distance_km'];
        $quantityKg = (float) $data['quantity_kg'];
        $ratePerKm = (float) $vehicle->price_per_km;

        $baseCost = round($ratePerKm * $distanceKm, 2);
        $loadingCharges = round((float) ($data['loading_charges'] ?? $vehicle->loading_charges ?? 0), 2);
        $tollCharges = round((float) ($data['toll_charges'] ?? 0), 2);

        $fuelRate = (float) ($data['fuel_rate_per_litre'] ?? config('transport.fuel_rate_per_litre', 90.0));
        $fuelConsumption = (float) config('transport.fuel_consumption_l_per_km', 0.15);
        $fuelCharges = round($fuelRate * $distanceKm * $fuelConsumption, 2);

        $totalCost = round($baseCost + $loadingCharges + $tollCharges + $fuelCharges, 2);

        $speed = $vehicle->vehicleType?->avg_speed_kmph !== null
            ? (float) $vehicle->vehicleType->avg_speed_kmph
            : (float) config('transport.avg_speed_kmph', 40.0);

        $travelTime = $speed > 0 ? round($distanceKm / $speed, 2) : 0.0;

        return [
            'vehicle' => $vehicle,
            'cost_breakdown' => [
                'base_cost' => $baseCost,
                'loading_charges' => $loadingCharges,
                'toll_charges' => $tollCharges,
                'fuel_charges' => $fuelCharges,
            ],
            'fuel_rate_per_litre' => $fuelRate,
            'total_cost' => $totalCost,
            'estimated_travel_time_hours' => $travelTime,
            'distance_km' => $distanceKm,
            'quantity_kg' => $quantityKg,
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function sanitizeVehicleData(int $ownerId, array $data, ?Vehicle $current = null): array
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
            'vehicle_type_id' => $value('vehicle_type_id'),
            'name' => $value('name'),
            'vehicle_number' => $value('vehicle_number'),
            'capacity_kg' => $value('capacity_kg'),
            'price_per_km' => $value('price_per_km'),
            'loading_charges' => $value('loading_charges'),
            'driver_name' => $value('driver_name'),
            'driver_phone' => $value('driver_phone'),
            'contact_phone' => $value('contact_phone'),
            'pincode' => $value('pincode'),
            'district_id' => $value('district_id'),
            'taluka_id' => $value('taluka_id'),
            'village_id' => $value('village_id'),
            'lat' => $value('lat'),
            'lng' => $value('lng'),
            'service_areas' => $value('service_areas'),
            'is_available' => (bool) $value('is_available', true),
            'is_active' => (bool) $value('is_active', true),
            'image_file_id' => $value('image_file_id'),
            'images_json' => $imageIds,
            'rating_avg' => $value('rating_avg', 0),
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

    private function assertVehicleOwnership(int $ownerId, int $vehicleId): Vehicle
    {
        $vehicle = $this->vehicles->findById($vehicleId);

        if ($vehicle === null) {
            throw new DomainException(sprintf('Vehicle [%d] does not exist.', $vehicleId));
        }

        if ((int) $vehicle->owner_id !== $ownerId) {
            throw new DomainException('You do not own this vehicle.');
        }

        return $vehicle;
    }

    private function assertBookable(int $userId, int $vehicleId): Vehicle
    {
        $vehicle = $this->vehicles->findById($vehicleId);

        if ($vehicle === null || ! (bool) $vehicle->is_active) {
            throw new DomainException(sprintf('Vehicle [%d] is not available.', $vehicleId));
        }

        if ((int) $vehicle->owner_id === $userId) {
            throw new DomainException('You cannot book your own vehicle.');
        }

        return $vehicle;
    }

    private function assertOwnerBooking(int $userId, int $bookingId): TransportBooking
    {
        $booking = $this->bookings->findBookingForOwner($bookingId, $userId);

        if ($booking === null) {
            throw new DomainException(sprintf('Booking [%d] does not exist on your vehicle.', $bookingId));
        }

        return $booking;
    }

    private function assertBookingWindow(Carbon $pickupAt, Carbon $dropoffAt, float $quantityKg, float $capacityKg): void
    {
        if ($pickupAt->isPast() && ! $pickupAt->isToday()) {
            throw new DomainException('Pickup time must not be in the past.');
        }

        if ($dropoffAt->lte($pickupAt)) {
            throw new DomainException('Drop-off time must be after the pickup time.');
        }

        if ($quantityKg <= 0) {
            throw new DomainException('Quantity must be greater than zero.');
        }

        if ($capacityKg > 0 && $quantityKg > $capacityKg) {
            throw new DomainException(sprintf(
                'Quantity exceeds vehicle capacity (%.2f kg).',
                $capacityKg,
            ));
        }
    }

    /**
     * @param  Collection<int, TransportVehicleType>  $types
     */
    private function selectFittingVehicle(Collection $types, float $quantityKg): ?TransportVehicleType
    {
        $fitting = $types
            ->filter(function (TransportVehicleType $type) use ($quantityKg): bool {
                $min = $type->min_capacity_kg !== null ? (float) $type->min_capacity_kg : 0.0;
                $max = $type->max_capacity_kg !== null ? (float) $type->max_capacity_kg : PHP_FLOAT_MAX;

                return $quantityKg >= $min && $quantityKg <= $max;
            })
            ->sortBy('max_capacity_kg');

        $preferred = $fitting->first();

        if ($preferred !== null) {
            return $preferred;
        }

        return $types->sortByDesc('max_capacity_kg')->first();
    }
}
