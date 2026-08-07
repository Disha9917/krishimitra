<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\FarmerField;
use App\Repositories\Contracts\FarmerFieldRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentFarmerFieldRepository extends BaseEloquentRepository implements FarmerFieldRepositoryInterface
{
    public function __construct(FarmerField $model)
    {
        parent::__construct($model);
    }

    public function linkedFields(int $userId): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->with(['soilType', 'currentCrop'])
                ->get();
    }
}
