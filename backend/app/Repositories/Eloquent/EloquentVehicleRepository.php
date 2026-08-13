<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Vehicle;
use App\Repositories\Contracts\VehicleRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentVehicleRepository extends BaseEloquentRepository implements VehicleRepositoryInterface
{
    public function __construct(Vehicle $model)
    {
        parent::__construct($model);
    }

    public function searchVehicles(array $filters, int $limit): Collection
    {
        $query = $this->model->newQuery();

        if (isset($filters['district_id'])) {
            $query->where('district_id', $filters['district_id']);
        }

        if (isset($filters['taluka_id'])) {
            $query->where('taluka_id', $filters['taluka_id']);
        }

        if (isset($filters['vehicle_type_id'])) {
            $query->where('vehicle_type_id', $filters['vehicle_type_id']);
        }

        if (isset($filters['min_capacity_kg'])) {
            $query->where('capacity_kg', '>=', (float) $filters['min_capacity_kg']);
        }

        if (isset($filters['max_capacity_kg'])) {
            $query->where('capacity_kg', '<=', (float) $filters['max_capacity_kg']);
        }

        if (array_key_exists('is_available', $filters) && $filters['is_available'] !== null && $filters['is_available'] !== '') {
            $query->where('is_available', (bool) $filters['is_available']);
        }

        if (isset($filters['min_price'])) {
            $query->where('price_per_km', '>=', (float) $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('price_per_km', '<=', (float) $filters['max_price']);
        }

        if (isset($filters['search']) && $filters['search'] !== '') {
            $query->where('name', 'ilike', '%' . $filters['search'] . '%');
        }

        return $query->orderByDesc('id')->limit($limit)->get();
    }

    public function vehiclesForOwner(int $ownerId): Collection
    {
        return $this->model
            ->where('owner_id', $ownerId)
            ->orderByDesc('id')
            ->get();
    }

    public function statsForOwner(int $ownerId): array
    {
        $query = $this->model->where('owner_id', $ownerId);

        return [
            'total' => (int) (clone $query)->count(),
            'available' => (int) (clone $query)->where('is_available', true)->count(),
            'capacity_kg' => (float) (clone $query)->sum('capacity_kg'),
        ];
    }
}
