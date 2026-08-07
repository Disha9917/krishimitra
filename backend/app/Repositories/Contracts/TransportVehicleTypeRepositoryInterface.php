<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\TransportVehicleType;
use Illuminate\Database\Eloquent\Collection;

interface TransportVehicleTypeRepositoryInterface extends BaseRepositoryInterface
{

    public function activeTypes(): Collection;
}
