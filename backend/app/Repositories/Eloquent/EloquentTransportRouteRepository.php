<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\TransportRoute;
use App\Repositories\Contracts\TransportRouteRepositoryInterface;

class EloquentTransportRouteRepository extends BaseEloquentRepository implements TransportRouteRepositoryInterface
{
    public function __construct(TransportRoute $model)
    {
        parent::__construct($model);
    }

    public function findRoute(string $originKey, string $destinationKey): ?TransportRoute
    {
            return $this->model
                ->where('origin_key', $originKey)
                ->where('destination_key', $destinationKey)
                ->first();
    }
}
