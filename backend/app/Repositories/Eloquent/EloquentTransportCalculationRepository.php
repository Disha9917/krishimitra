<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\TransportCalculation;
use App\Repositories\Contracts\TransportCalculationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentTransportCalculationRepository extends BaseEloquentRepository implements TransportCalculationRepositoryInterface
{
    public function __construct(TransportCalculation $model)
    {
        parent::__construct($model);
    }

    public function calculationsForUser(int $userId): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->orderByDesc('id')
                ->get();
    }
}
