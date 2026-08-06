<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\GovernmentScheme;
use App\Repositories\Contracts\GovernmentSchemeRepositoryInterface;
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
}
