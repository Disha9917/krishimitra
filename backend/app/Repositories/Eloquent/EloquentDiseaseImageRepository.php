<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\DiseaseImage;
use App\Repositories\Contracts\DiseaseImageRepositoryInterface;

class EloquentDiseaseImageRepository extends BaseEloquentRepository implements DiseaseImageRepositoryInterface
{
    public function __construct(DiseaseImage $model)
    {
        parent::__construct($model);
    }
}
