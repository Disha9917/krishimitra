<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\NearbyMandi;
use App\Repositories\Contracts\NearbyMandiRepositoryInterface;

class EloquentNearbyMandiRepository extends BaseEloquentRepository implements NearbyMandiRepositoryInterface
{
    public function __construct(NearbyMandi $model)
    {
        parent::__construct($model);
    }
}
