<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Equipment;
use App\Repositories\Contracts\EquipmentRepositoryInterface;
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
}
