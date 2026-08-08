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

    public function listPrices(array $filters = [], int $limit = 20): Collection
    {
        return $this->model
            ->newQuery()
            ->with(['mandi.district', 'crop'])
            ->when(isset($filters['crop_id']) && $filters['crop_id'] !== null, function (Builder $query) use ($filters): void {
                $query->where('crop_id', (int) $filters['crop_id']);
            })
            ->when(isset($filters['mandi_id']) && $filters['mandi_id'] !== null, function (Builder $query) use ($filters): void {
                $query->where('mandi_id', (int) $filters['mandi_id']);
            })
            ->when(isset($filters['district_id']) && $filters['district_id'] !== null, function (Builder $query) use ($filters): void {
                $query->whereHas('mandi', function (Builder $mandi) use ($filters): void {
                    $mandi->where('district_id', (int) $filters['district_id']);
                });
            })
            ->when(isset($filters['state']) && $filters['state'] !== null, function (Builder $query) use ($filters): void {
                $query->whereHas('mandi', function (Builder $mandi) use ($filters): void {
                    $mandi->where('state', $filters['state']);
                });
            })
            ->when(isset($filters['date']) && $filters['date'] !== null, function (Builder $query) use ($filters): void {
                $query->where('price_date', $filters['date']);
            })
            ->when(isset($filters['from']) && $filters['from'] !== null, function (Builder $query) use ($filters): void {
                $query->where('price_date', '>=', $filters['from']);
            })
            ->when(isset($filters['to']) && $filters['to'] !== null, function (Builder $query) use ($filters): void {
                $query->where('price_date', '<=', $filters['to']);
            })
            ->orderByDesc('price_date')
            ->orderByDesc('todays_price')
            ->limit($limit)
            ->get();
    }

    public function pricesBetween(string $from, string $to, array $filters = [], int $limit = 1000): Collection
    {
        return $this->model
            ->newQuery()
            ->with(['mandi.district', 'crop'])
            ->where('price_date', '>=', $from)
            ->where('price_date', '<=', $to)
            ->when(isset($filters['crop_id']) && $filters['crop_id'] !== null, function (Builder $query) use ($filters): void {
                $query->where('crop_id', (int) $filters['crop_id']);
            })
            ->when(isset($filters['mandi_id']) && $filters['mandi_id'] !== null, function (Builder $query) use ($filters): void {
                $query->where('mandi_id', (int) $filters['mandi_id']);
            })
            ->when(isset($filters['district_id']) && $filters['district_id'] !== null, function (Builder $query) use ($filters): void {
                $query->whereHas('mandi', function (Builder $mandi) use ($filters): void {
                    $mandi->where('district_id', (int) $filters['district_id']);
                });
            })
            ->when(isset($filters['state']) && $filters['state'] !== null, function (Builder $query) use ($filters): void {
                $query->whereHas('mandi', function (Builder $mandi) use ($filters): void {
                    $mandi->where('state', $filters['state']);
                });
            })
            ->orderBy('price_date')
            ->limit($limit)
            ->get();
    }

    public function latestPriceDate(array $filters = []): ?string
    {
        $date = $this->model
            ->newQuery()
            ->when(isset($filters['crop_id']) && $filters['crop_id'] !== null, function (Builder $query) use ($filters): void {
                $query->where('crop_id', (int) $filters['crop_id']);
            })
            ->when(isset($filters['mandi_id']) && $filters['mandi_id'] !== null, function (Builder $query) use ($filters): void {
                $query->where('mandi_id', (int) $filters['mandi_id']);
            })
            ->when(isset($filters['district_id']) && $filters['district_id'] !== null, function (Builder $query) use ($filters): void {
                $query->whereHas('mandi', function (Builder $mandi) use ($filters): void {
                    $mandi->where('district_id', (int) $filters['district_id']);
                });
            })
            ->when(isset($filters['state']) && $filters['state'] !== null, function (Builder $query) use ($filters): void {
                $query->whereHas('mandi', function (Builder $mandi) use ($filters): void {
                    $mandi->where('state', $filters['state']);
                });
            })
            ->max('price_date');

        return $date !== null ? (string) $date : null;
    }

    public function priceForDate(int $mandiId, int $cropId, string $date): ?MarketPrice
    {
        return $this->model
            ->where('mandi_id', $mandiId)
            ->where('crop_id', $cropId)
            ->where('price_date', $date)
            ->first();
    }

    public function priceHistory(int $cropId, int $mandiId, string $from, string $to): Collection
    {
        return $this->model
            ->newQuery()
            ->with(['mandi.district'])
            ->where('crop_id', $cropId)
            ->where('mandi_id', $mandiId)
            ->where('price_date', '>=', $from)
            ->where('price_date', '<=', $to)
            ->orderBy('price_date')
            ->get();
    }
}
