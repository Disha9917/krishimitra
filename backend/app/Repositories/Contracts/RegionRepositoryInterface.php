<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Region;
use Illuminate\Database\Eloquent\Collection;

interface RegionRepositoryInterface extends BaseRepositoryInterface
{

    public function activeRegions(): Collection;
}
