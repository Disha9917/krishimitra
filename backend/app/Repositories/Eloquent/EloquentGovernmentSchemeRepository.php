<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\GovernmentScheme;
use App\Repositories\Contracts\GovernmentSchemeRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class EloquentGovernmentSchemeRepository extends BaseEloquentRepository implements GovernmentSchemeRepositoryInterface
{
    public function __construct(GovernmentScheme $model)
    {
        parent::__construct($model);
    }

    public function activeSchemes(): Collection
    {
        return $this->model
            ->where('is_active', true)
            ->orderBy('title')
            ->get();
    }

    public function schemesByCategory(string $category): Collection
    {
        return $this->model
            ->where('category', $category)
            ->where('is_active', true)
            ->orderBy('title')
            ->get();
    }

    public function findActive(int $schemeId): ?GovernmentScheme
    {
        return $this->model
            ->where('is_active', true)
            ->find($schemeId);
    }

    public function listSchemes(array $filters = [], int $limit = 20): Collection
    {
        $query = $this->model
            ->where('is_active', true)
            ->newQuery();

        if (isset($filters['category']) && $filters['category'] !== '') {
            $query->where('category', (string) $filters['category']);
        }

        if (isset($filters['state']) && $filters['state'] !== '') {
            $state = (string) $filters['state'];
            $query->where(function (Builder $q) use ($state): void {
                $q->whereNull('state')->orWhere('state', 'ilike', $state);
            });
        }

        if (isset($filters['district_id']) && $filters['district_id'] !== null && $filters['district_id'] !== '') {
            $query->whereJsonContains('eligibility_criteria->districts', (int) $filters['district_id']);
        }

        if (isset($filters['crop_id']) && $filters['crop_id'] !== null && $filters['crop_id'] !== '') {
            $query->whereJsonContains('eligibility_criteria->crop_ids', (int) $filters['crop_id']);
        }

        if (isset($filters['search']) && $filters['search'] !== '') {
            $term = (string) $filters['search'];
            $query->where(function (Builder $q) use ($term): void {
                $q->where('title', 'ilike', '%'.$term.'%')
                    ->orWhere('code', 'ilike', '%'.$term.'%')
                    ->orWhere('description', 'ilike', '%'.$term.'%');
            });
        }

        return $query
            ->orderBy('title')
            ->limit($limit)
            ->get();
    }

    public function expiringSoon(int $days = 30): Collection
    {
        return $this->model
            ->where('is_active', true)
            ->whereNotNull('deadline')
            ->whereBetween('deadline', [today()->toDateString(), today()->addDays($days)->toDateString()])
            ->orderBy('deadline')
            ->get();
    }
}
