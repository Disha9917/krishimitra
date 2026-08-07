<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\TransportRoute;

interface TransportRouteRepositoryInterface extends BaseRepositoryInterface
{

    public function findRoute(string $originKey, string $destinationKey): ?TransportRoute;
}
