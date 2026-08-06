<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\FarmerCrop;
use App\Repositories\Contracts\FarmerCropRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentFarmerCropRepository extends BaseEloquentRepository implements FarmerCropRepositoryInterface
{
    public function __construct(FarmerCrop $model)
    {
        parent::__construct($model);
    }

    public function cropsForUser(int $userId): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->with(['crop', 'field'])
                ->orderByDesc('id')
                ->get();
    }

    public function cropsForField(int $fieldId): Collection
    {
            return $this->model
                ->where('field_id', $fieldId)
                ->orderByDesc('id')
                ->get();
    }
}
