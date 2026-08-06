<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Taluka;
use App\Repositories\Contracts\TalukaRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentTalukaRepository extends BaseEloquentRepository implements TalukaRepositoryInterface
{
    public function __construct(Taluka $model)
    {
        parent::__construct($model);
    }

    public function talukasForDistrict(int $districtId): Collection
    {
            return $this->model
                ->where('district_id', $districtId)
                ->orderBy('name')
                ->get();
    }
}
