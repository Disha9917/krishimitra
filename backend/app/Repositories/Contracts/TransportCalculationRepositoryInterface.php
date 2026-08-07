<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\TransportCalculation;
use Illuminate\Database\Eloquent\Collection;

interface TransportCalculationRepositoryInterface extends BaseRepositoryInterface
{

    public function calculationsForUser(int $userId): Collection;
}
