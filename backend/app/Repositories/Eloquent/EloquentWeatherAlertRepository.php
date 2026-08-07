<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\WeatherAlert;
use App\Repositories\Contracts\WeatherAlertRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class EloquentWeatherAlertRepository extends BaseEloquentRepository implements WeatherAlertRepositoryInterface
{
    public function __construct(WeatherAlert $model)
    {
        parent::__construct($model);
    }

    public function activeAlerts(): Collection
    {
            return $this->model
                ->where(function (Builder $query): void {
                    $query->whereNull('valid_until')
                        ->orWhere('valid_until', '>=', now());
                })
                ->orderByDesc('valid_from')
                ->get();
    }

    public function alertsForDistrict(int $districtId): Collection
    {
            return $this->model
                ->where('district_id', $districtId)
                ->orderByDesc('valid_from')
                ->get();
    }
}
