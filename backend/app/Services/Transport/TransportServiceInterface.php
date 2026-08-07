<?php

declare(strict_types=1);

namespace App\Services\Transport;

use App\Models\TransportRoute;
use App\Models\TransportVehicleType;
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
}
