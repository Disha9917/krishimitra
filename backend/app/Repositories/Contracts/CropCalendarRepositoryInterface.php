<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\CropCalendar;
use Illuminate\Database\Eloquent\Collection;

interface CropCalendarRepositoryInterface extends BaseRepositoryInterface
{

    public function calendarForCrop(int $cropId): Collection;
}
