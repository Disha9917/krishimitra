<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Crop;
use App\Repositories\Contracts\CropRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentCropRepository extends BaseEloquentRepository implements CropRepositoryInterface
{
    public function __construct(Crop $model)
    {
        parent::__construct($model);
    }

    public function activeCrops(): Collection
    {
            return $this->model
                ->where('is_active', true)
                ->orderBy('name')
                ->get();
    }

    public function seasonalCrops(string $season): Collection
    {
            return $this->model
                ->where('season', $season)
                ->where('is_active', true)
                ->orderBy('name')
                ->get();
    }

    public function cropHistory(int $cropId, int $limit = 30): Collection
    {
            $crop = $this->model->find($cropId);
            
            if ($crop === null) {
                return new Collection();
            }
            
            return $crop->cropCalendars()
                ->orderBy('day_start')
                ->limit($limit)
                ->get();
    }
}
