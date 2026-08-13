<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Collection;

interface VehicleRepositoryInterface extends BaseRepositoryInterface
{

    /**
     * @param  array<string, mixed>  $filters
     * @return Collection<int, Vehicle>
     */
    public function searchVehicles(array $filters, int $limit): Collection;

    /**
     * @return Collection<int, Vehicle>
     */
    public function vehiclesForOwner(int $ownerId): Collection;

    /**
     * Vehicle statistics for the owner dashboard.
     *
     * @return array{
     *     total: int,
     *     available: int,
     *     capacity_kg: float
     * }
     */
    public function statsForOwner(int $ownerId): array;
}
