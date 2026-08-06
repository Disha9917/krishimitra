<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Mandi;
use App\Repositories\Contracts\MandiRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentMandiRepository extends BaseEloquentRepository implements MandiRepositoryInterface
{
    public function __construct(Mandi $model)
    {
        parent::__construct($model);
    }

    public function nearbyMandis(float $lat, float $lng, float $radiusKm = 50.0, int $limit = 10): Collection
    {
            $haversine = '(6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat))))';
            
            return $this->model
                ->selectRaw('*, ' . $haversine . ' AS distance_km', [$lat, $lng, $lat])
                ->where('is_active', true)
                ->whereRaw($haversine . ' <= ?', [$lat, $lng, $lat, $radiusKm])
                ->orderBy('distance_km')
                ->limit($limit)
                ->get();
    }

    public function activeMandis(): Collection
    {
            return $this->model
                ->where('is_active', true)
                ->orderBy('name')
                ->get();
    }
}
