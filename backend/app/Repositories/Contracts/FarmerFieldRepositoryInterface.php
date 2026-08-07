<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\FarmerField;
use Illuminate\Database\Eloquent\Collection;

interface FarmerFieldRepositoryInterface extends BaseRepositoryInterface
{

    public function linkedFields(int $userId): Collection;
}
