<?php

declare(strict_types=1);

namespace App\Services\Market;

use App\Models\Mandi;
use App\Models\MarketPrice;
use App\Models\PricePrediction;
use Illuminate\Database\Eloquent\Collection;

interface MarketServiceInterface
{
    public function latestPrices(?int $cropId = null, ?int $mandiId = null, int $limit = 20): Collection;

    public function priceHistory(int $cropId, int $mandiId, int $days = 30): Collection;

    /**
     * The most recent price prediction for a crop.
     */
    public function pricePrediction(int $cropId): ?PricePrediction;

    /**
     * Mandis within a radius of the given coordinates (haversine).
     */
    public function nearbyMandis(float $lat, float $lng, float $radiusKm = 50.0, int $limit = 10): Collection;

    /**
     * Top paying markets for a crop, ranked by latest price.
     */
    public function bestSellingMarket(int $cropId, int $limit = 1): Collection;

    public function activeMandis(): Collection;

    public function findMandi(int $mandiId): ?Mandi;
}
