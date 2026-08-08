<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\ColdStorage;
use App\Repositories\Contracts\ColdStorageRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class EloquentColdStorageRepository extends BaseEloquentRepository implements ColdStorageRepositoryInterface
{
    public function __construct(ColdStorage $model)
    {
        parent::__construct($model);
    }

    public function availableStorage(): Collection
    {
        return $this->model
            ->where('is_active', true)
            ->orderByDesc('id')
            ->get();
    }

    public function searchStorage(array $filters, int $limit): Collection
    {
        $query = $this->model->newQuery();

        if (isset($filters['district_id'])) {
            $query->where('district_id', $filters['district_id']);
        }

        if (isset($filters['taluka_id'])) {
            $query->where('taluka_id', $filters['taluka_id']);
        }

        if (isset($filters['village_id'])) {
            $query->where('village_id', $filters['village_id']);
        }

        if (isset($filters['crop_id'])) {
            $query->whereJsonContains('supported_crops', (int) $filters['crop_id']);
        }

        if (isset($filters['min_price'])) {
            $query->where('rate_per_tonne_month', '>=', (float) $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('rate_per_tonne_month', '<=', (float) $filters['max_price']);
        }

        if (isset($filters['min_temp'])) {
            $query->where(fn (Builder $inner) => $inner
                ->whereNull('min_temp_c')
                ->orWhere('min_temp_c', '>=', (float) $filters['min_temp']));
        }

        if (isset($filters['max_temp'])) {
            $query->where(fn (Builder $inner) => $inner
                ->whereNull('max_temp_c')
                ->orWhere('max_temp_c', '<=', (float) $filters['max_temp']));
        }

        if (array_key_exists('has_capacity', $filters)) {
            $query->whereColumn('occupied_tonnes', '<', 'capacity_tonnes');
        }

        if (isset($filters['search']) && $filters['search'] !== '') {
            $query->where('name', 'ilike', '%' . $filters['search'] . '%');
        }

        return $query->orderByDesc('id')->limit($limit)->get();
    }

    public function storagesForOwner(int $ownerId): Collection
    {
        return $this->model
            ->where('owner_id', $ownerId)
            ->orderByDesc('id')
            ->get();
    }

    public function capacityStatsForOwner(int $ownerId): array
    {
        $query = $this->model->where('owner_id', $ownerId);

        return [
            'total' => (int) (clone $query)->count(),
            'capacity_tonnes' => (float) (clone $query)->sum('capacity_tonnes'),
            'occupied_tonnes' => (float) (clone $query)->sum('occupied_tonnes'),
        ];
    }
}
