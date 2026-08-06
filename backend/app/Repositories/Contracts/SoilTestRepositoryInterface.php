<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\SoilTest;
use Illuminate\Database\Eloquent\Collection;

interface SoilTestRepositoryInterface extends BaseRepositoryInterface
{

    public function latestForFarmer(int $userId, int $limit = 5): Collection;
}
