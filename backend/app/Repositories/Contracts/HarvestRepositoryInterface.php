<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Harvest;
use Illuminate\Database\Eloquent\Collection;

interface HarvestRepositoryInterface extends BaseRepositoryInterface
{

    public function harvestsForFarmer(int $userId): Collection;
}
