<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\ColdStorage;
use App\Repositories\Contracts\ColdStorageRepositoryInterface;
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
}
