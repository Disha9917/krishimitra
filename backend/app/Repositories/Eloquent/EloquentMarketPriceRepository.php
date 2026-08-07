<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\MarketPrice;
use App\Repositories\Contracts\MarketPriceRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class EloquentMarketPriceRepository extends BaseEloquentRepository implements MarketPriceRepositoryInterface
{
    public function __construct(MarketPrice $model)
    {
        parent::__construct($model);
    }

    public function latestPrices(?int $cropId = null, ?int $mandiId = null, int $limit = 20): Collection
    {
            return $this->model
                ->newQuery()
                ->when($cropId !== null, function (Builder $query) use ($cropId): void {
                    $query->where('crop_id', $cropId);
                })
                ->when($mandiId !== null, function (Builder $query) use ($mandiId): void {
                    $query->where('mandi_id', $mandiId);
                })
                ->orderByDesc('price_date')
                ->orderByDesc('todays_price')
                ->limit($limit)
                ->get();
    }

    public function priceHistory(int $cropId, int $mandiId, int $days = 30): Collection
    {
            return $this->model
                ->where('crop_id', $cropId)
                ->where('mandi_id', $mandiId)
                ->where('price_date', '>=', today()->subDays($days)->toDateString())
                ->orderBy('price_date')
                ->get();
    }

    public function topMarkets(int $cropId, int $limit = 5): Collection
    {
            return $this->model
                ->where('crop_id', $cropId)
                ->orderByDesc('price_date')
                ->orderByDesc('todays_price')
                ->limit($limit)
                ->get();
    }
}
