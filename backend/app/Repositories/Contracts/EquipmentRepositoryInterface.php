<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Equipment;
use Illuminate\Database\Eloquent\Collection;

interface EquipmentRepositoryInterface extends BaseRepositoryInterface
{

    public function availableEquipment(): Collection;
}
