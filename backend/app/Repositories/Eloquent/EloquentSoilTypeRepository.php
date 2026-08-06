<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\SoilType;
use App\Repositories\Contracts\SoilTypeRepositoryInterface;

class EloquentSoilTypeRepository extends BaseEloquentRepository implements SoilTypeRepositoryInterface
{
    public function __construct(SoilType $model)
    {
        parent::__construct($model);
    }
}
