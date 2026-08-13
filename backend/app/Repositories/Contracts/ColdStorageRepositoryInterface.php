<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\ColdStorage;
use Illuminate\Database\Eloquent\Collection;

interface ColdStorageRepositoryInterface extends BaseRepositoryInterface
{

    /**
     * @return Collection<int, ColdStorage>
     */
    public function availableStorage(): Collection;

    /**
     * Search facilities with optional location/crop/price/temperature filters.
     *
     * @param  array<string, mixed>  $filters
     * @return Collection<int, ColdStorage>
     */
    public function searchStorage(array $filters, int $limit): Collection;

    /**
     * @return Collection<int, ColdStorage>
     */
    public function storagesForOwner(int $ownerId): Collection;

    /**
     * Capacity aggregates across the owner's facilities.
     *
     * @return array{total: int, capacity_tonnes: float, occupied_tonnes: float}
     */
    public function capacityStatsForOwner(int $ownerId): array;
}
