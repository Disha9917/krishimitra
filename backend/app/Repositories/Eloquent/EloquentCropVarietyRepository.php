<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\CropVariety;
use App\Repositories\Contracts\CropVarietyRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentCropVarietyRepository extends BaseEloquentRepository implements CropVarietyRepositoryInterface
{
    public function __construct(CropVariety $model)
    {
        parent::__construct($model);
    }

    public function varietiesForCrop(int $cropId): Collection
    {
            return $this->model
                ->where('crop_id', $cropId)
                ->orderBy('name')
                ->get();
    }
}
