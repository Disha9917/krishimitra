<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\WeatherAlert;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

interface WeatherAlertRepositoryInterface extends BaseRepositoryInterface
{

    public function activeAlerts(): Collection;

    public function alertsForDistrict(int $districtId): Collection;
}
