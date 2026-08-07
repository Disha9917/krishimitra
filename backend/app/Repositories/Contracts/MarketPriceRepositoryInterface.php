<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\MarketPrice;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

interface MarketPriceRepositoryInterface extends BaseRepositoryInterface
{

    public function latestPrices(?int $cropId = null, ?int $mandiId = null, int $limit = 20): Collection;

    public function priceHistory(int $cropId, int $mandiId, int $days = 30): Collection;

    public function topMarkets(int $cropId, int $limit = 5): Collection;
}
