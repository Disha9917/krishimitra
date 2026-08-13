<?php

declare(strict_types=1);

namespace App\Services\Transport;

use App\Models\TransportBooking;
use App\Models\TransportRoute;
use App\Models\TransportVehicleType;
use App\Models\Vehicle;
use App\Services\Common\DTO\TransportQuoteDTO;
use Illuminate\Database\Eloquent\Collection;

interface TransportServiceInterface
{
    /**
     * Compute a transport quote (route-aware, capacity-aware) and persist it.
     *
     * @throws \DomainException when no vehicle type can carry the load
     */
    public function calculateTransport(
        int $userId,
        string $origin,
        string $destination,
        float $quantityKg,
        ?float $distanceKm = null,
        ?int $vehicleTypeId = null,
    ): TransportQuoteDTO;

    public function findRoute(string $originKey, string $destinationKey): ?TransportRoute;

    public function vehicleTypes(): Collection;

    public function calculationsForUser(int $userId): Collection;

    /**
     * @param  array<string, mixed>  $filters
     * @return Collection<int, Vehicle>
     */
    public function listVehicles(array $filters, int $limit): Collection;

    public function findVehicle(int $vehicleId): ?Vehicle;

    /**
     * @param  array<string, mixed>  $data
     */
    public function createVehicle(int $ownerId, array $data): Vehicle;

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateVehicle(int $ownerId, int $vehicleId, array $data): Vehicle;

    public function deleteVehicle(int $ownerId, int $vehicleId): bool;

    /**
     * @return Collection<int, Vehicle>
     */
    public function myVehicles(int $ownerId): Collection;

    /**
     * @return array<string, mixed>
     */
    public function dashboard(int $userId): array;

    /**
     * Cost calculator — returns the full breakdown for a trip.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function costEstimate(int $vehicleId, array $data): array;

    /**
     * Route planning — estimated distance and duration for a trip.
     *
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     */
    public function routeEstimate(array $params): array;

    /**
     * @param  array<string, mixed>  $data
     */
    public function requestBooking(int $userId, int $vehicleId, array $data): TransportBooking;

    public function approveBooking(int $userId, int $bookingId): TransportBooking;

    public function rejectBooking(int $userId, int $bookingId, ?string $reason = null): TransportBooking;

    public function cancelBooking(int $userId, int $bookingId, ?string $reason = null): TransportBooking;

    public function completeBooking(int $userId, int $bookingId): TransportBooking;

    /**
     * @param  array<string, mixed>  $filters
     * @return Collection<int, TransportBooking>
     */
    public function myBookings(int $userId, array $filters, int $limit): Collection;

    /**
     * @param  array<string, mixed>  $filters
     * @return Collection<int, TransportBooking>
     */
    public function ownerBookings(int $userId, array $filters, int $limit): Collection;

    public function findBooking(int $userId, int $bookingId): ?TransportBooking;
}
