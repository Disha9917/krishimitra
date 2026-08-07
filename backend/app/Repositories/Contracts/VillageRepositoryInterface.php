<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Village;
use Illuminate\Database\Eloquent\Collection;

interface VillageRepositoryInterface extends BaseRepositoryInterface
{

    public function villagesForTaluka(int $talukaId): Collection;
}
