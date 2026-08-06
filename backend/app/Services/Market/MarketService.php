<?php

declare(strict_types=1);

namespace App\Services\Market;

use App\Models\Mandi;
use App\Models\MarketPrice;
use App\Models\PricePrediction;
use App\Repositories\Contracts\MandiRepositoryInterface;
use App\Repositories\Contracts\MarketPriceRepositoryInterface;
use App\Repositories\Contracts\PricePredictionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class MarketService implements MarketServiceInterface
{
    public function __construct(
        private readonly MarketPriceRepositoryInterface $prices,
        private readonly PricePredictionRepositoryInterface $predictions,
        private readonly MandiRepositoryInterface $mandis,
    ) {
    }

    public function latestPrices(?int $cropId = null, ?int $mandiId = null, int $limit = 20): Collection
    {
        return $this->prices->latestPrices($cropId, $mandiId, $limit);
    }

    public function priceHistory(int $cropId, int $mandiId, int $days = 30): Collection
    {
        return $this->prices->priceHistory($cropId, $mandiId, $days);
    }

    public function pricePrediction(int $cropId): ?PricePrediction
    {
        return $this->predictions->predictionsForCrop($cropId)->first();
    }

    public function nearbyMandis(float $lat, float $lng, float $radiusKm = 50.0, int $limit = 10): Collection
    {
        return $this->mandis->nearbyMandis($lat, $lng, $radiusKm, $limit);
    }

    public function bestSellingMarket(int $cropId, int $limit = 1): Collection
    {
        return $this->prices->topMarkets($cropId, $limit);
    }

    public function activeMandis(): Collection
    {
        return $this->mandis->activeMandis();
    }

    public function findMandi(int $mandiId): ?Mandi
    {
        return $this->mandis->findById($mandiId);
    }
}
