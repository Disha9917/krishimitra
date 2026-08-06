<?php

declare(strict_types=1);

namespace App\Services\Transport;

use App\Models\TransportRoute;
use App\Models\TransportVehicleType;
use App\Repositories\Contracts\TransportCalculationRepositoryInterface;
use App\Repositories\Contracts\TransportRouteRepositoryInterface;
use App\Repositories\Contracts\TransportVehicleTypeRepositoryInterface;
use App\Services\Common\DTO\TransportQuoteDTO;
use DomainException;
use Illuminate\Database\Eloquent\Collection;

class TransportService implements TransportServiceInterface
{
    private const QUINTAL_KG = 100.0;

    public function __construct(
        private readonly TransportCalculationRepositoryInterface $calculations,
        private readonly TransportRouteRepositoryInterface $routes,
        private readonly TransportVehicleTypeRepositoryInterface $vehicleTypes,
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
