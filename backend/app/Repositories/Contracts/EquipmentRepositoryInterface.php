<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Equipment;
use Illuminate\Database\Eloquent\Collection;

interface EquipmentRepositoryInterface extends BaseRepositoryInterface
{

    /**
     * @param  array<string, mixed>  $filters
     * @return Collection<int, Equipment>
     */
    public function availableEquipment(): Collection;

    /**
     * Search listings with optional type/category/location/price/rating filters.
     *
     * @param  array<string, mixed>  $filters
     * @return Collection<int, Equipment>
     */
    public function searchEquipment(array $filters, int $limit): Collection;

    /**
     * @return Collection<int, Equipment>
     */
    public function equipmentForOwner(int $ownerId): Collection;

    /**
     * @return array{total: int, available: int}
     */
    public function statsForOwner(int $ownerId): array;
}
