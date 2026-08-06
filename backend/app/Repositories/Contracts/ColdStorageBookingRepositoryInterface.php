<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\ColdStorageBooking;
use Illuminate\Database\Eloquent\Collection;

interface ColdStorageBookingRepositoryInterface extends BaseRepositoryInterface
{

    public function bookingsForUser(int $userId): Collection;
}
