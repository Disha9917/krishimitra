<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\TransportVehicleType;
use App\Repositories\Contracts\TransportVehicleTypeRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentTransportVehicleTypeRepository extends BaseEloquentRepository implements TransportVehicleTypeRepositoryInterface
{
    public function __construct(TransportVehicleType $model)
    {
        parent::__construct($model);
    }

    public function activeTypes(): Collection
    {
            return $this->model
                ->where('is_active', true)
                ->orderBy('name')
                ->get();
    }
}
