<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\EquipmentBooking;
use App\Repositories\Contracts\EquipmentBookingRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentEquipmentBookingRepository extends BaseEloquentRepository implements EquipmentBookingRepositoryInterface
{
    public function __construct(EquipmentBooking $model)
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
