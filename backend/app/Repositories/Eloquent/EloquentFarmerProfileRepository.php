<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\FarmerProfile;
use App\Repositories\Contracts\FarmerProfileRepositoryInterface;

class EloquentFarmerProfileRepository extends BaseEloquentRepository implements FarmerProfileRepositoryInterface
{
    public function __construct(FarmerProfile $model)
    {
        parent::__construct($model);
    }

    public function farmerDashboard(int $userId): ?FarmerProfile
    {
            return $this->model
                ->where('user_id', $userId)
                ->with(['user', 'primaryCrop', 'district', 'taluka'])
                ->first();
    }
}
