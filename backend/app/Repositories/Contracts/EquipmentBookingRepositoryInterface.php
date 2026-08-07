<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\EquipmentBooking;
use Illuminate\Database\Eloquent\Collection;

interface EquipmentBookingRepositoryInterface extends BaseRepositoryInterface
{

    public function bookingsForUser(int $userId): Collection;
}
