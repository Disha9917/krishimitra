<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\CropCalendar;
use App\Repositories\Contracts\CropCalendarRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentCropCalendarRepository extends BaseEloquentRepository implements CropCalendarRepositoryInterface
{
    public function __construct(CropCalendar $model)
    {
        parent::__construct($model);
    }

    public function calendarForCrop(int $cropId): Collection
    {
            return $this->model
                ->where('crop_id', $cropId)
                ->orderBy('day_start')
                ->get();
    }
}
