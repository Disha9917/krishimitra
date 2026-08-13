<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Equipment;
use App\Repositories\Contracts\EquipmentRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class EloquentEquipmentRepository extends BaseEloquentRepository implements EquipmentRepositoryInterface
{
    public function __construct(Equipment $model)
    {
        parent::__construct($model);
    }

    public function availableEquipment(): Collection
    {
        return $this->model
            ->where('is_available', true)
            ->orderByDesc('id')
            ->get();
    }

    public function searchEquipment(array $filters, int $limit): Collection
    {
        $query = $this->model->newQuery();

        if (isset($filters['type'])) {
            $query->where('equipment_type', $filters['type']);
        }

        if (isset($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (isset($filters['district_id'])) {
            $query->where('district_id', $filters['district_id']);
        }

        if (isset($filters['taluka_id'])) {
            $query->where('taluka_id', $filters['taluka_id']);
        }

        if (isset($filters['village_id'])) {
            $query->where('village_id', $filters['village_id']);
        }

        if (array_key_exists('availability', $filters)) {
            $query->where('is_available', (bool) $filters['availability']);
        }

        if (isset($filters['min_price'])) {
            $query->where('daily_rate', '>=', (float) $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('daily_rate', '<=', (float) $filters['max_price']);
        }

        if (isset($filters['min_rating'])) {
            $query->where('rating_avg', '>=', (float) $filters['min_rating']);
        }

        if (isset($filters['owner_id'])) {
            $query->where('provider_id', $filters['owner_id']);
        }

        if (isset($filters['search']) && $filters['search'] !== '') {
            $term = '%' . $filters['search'] . '%';
            $query->where(function (Builder $inner) use ($term): void {
                $inner->where('name', 'ilike', $term)
                    ->orWhere('brand', 'ilike', $term)
                    ->orWhere('model', 'ilike', $term);
            });
        }

        return $query->orderByDesc('id')->limit($limit)->get();
    }

    public function equipmentForOwner(int $ownerId): Collection
    {
        return $this->model
            ->where('provider_id', $ownerId)
            ->orderByDesc('id')
            ->get();
    }

    public function statsForOwner(int $ownerId): array
    {
        $query = $this->model->where('provider_id', $ownerId);

        return [
            'total' => (int) (clone $query)->count(),
            'available' => (int) (clone $query)->where('is_available', true)->count(),
        ];
    }
}
