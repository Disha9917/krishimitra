<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\ColdStorageBooking;
use App\Repositories\Contracts\ColdStorageBookingRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentColdStorageBookingRepository extends BaseEloquentRepository implements ColdStorageBookingRepositoryInterface
{
    public function __construct(ColdStorageBooking $model)
    {
        parent::__construct($model);
    }

    public function bookingsForUser(int $userId): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->orderByDesc('id')
                ->get();
    }
}
