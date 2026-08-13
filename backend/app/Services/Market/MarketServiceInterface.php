<?php

declare(strict_types=1);

namespace App\Services\Market;

use App\Models\Mandi;
use App\Models\MarketPrice;
use App\Services\Market\Providers\PriceDataProviderInterface;
use Illuminate\Database\Eloquent\Collection;

interface MarketServiceInterface
{
    /**
     * List price records applying crop/mandi/district/state/date filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function listPrices(array $filters = [], int $limit = 20): Collection;

    /**
     * Today's price records (optionally filtered).
     *
     * @param  array<string, mixed>  $filters
     */
    public function todayPrices(array $filters = [], int $limit = 50): Collection;

    /**
     * Fetch a single price record.
     */
    public function getPrice(int $priceId): ?MarketPrice;

    /**
     * Persist an immutable price record; trend and change % are derived from the
     * previous day's record so history is never rewritten.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws \DomainException when a record already exists for the mandi/crop/date
     */
    public function ingestPrice(array $data): MarketPrice;

    /**
     * List active mandis applying district/state/search filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function listMandis(array $filters = [], int $limit = 50): Collection;

    /**
     * Fetch a single mandi.
     */
    public function getMandi(int $mandiId): ?Mandi;

    /**
     * Mandis within a radius of the given coordinates (haversine), closest first.
     *
     * @return array{origin: array{lat: float, lng: float}, mandis: Collection}
     */
    public function nearbyMandis(float $lat, float $lng, float $radiusKm = 50.0, int $limit = 10): array;

    /**
     * Best nearby markets for a farmer's stored field coordinates.
     *
     * @return array{origin: array{lat: float, lng: float}, mandis: Collection}
     *
     * @throws \DomainException when the field is not owned or has no coordinates
     */
    public function mandisNearField(int $userId, int $fieldId, float $radiusKm = 50.0, int $limit = 10): array;

    /**
     * Price history aggregated by period (daily/weekly/monthly/yearly).
     * Historical records are immutable and never overwritten.
     *
     * @return array<string, mixed>
     */
    public function priceHistory(int $cropId, int $mandiId, string $period = 'daily', ?string $from = null, ?string $to = null): array;

    /**
     * Rule-based price prediction generated from historical data, persisted to
     * price_predictions and logged to the user's prediction history.
     *
     * @return array<string, mixed>
     */
    public function pricePrediction(int $userId, int $cropId, ?int $mandiId = null, int $periodDays = 7): array;

    /**
     * Best selling recommendation: best paying mandi, expected price, estimated
     * distance and suggested selling time.
     *
     * @return array<string, mixed>|null
     */
    public function bestSellingMarket(int $cropId, ?int $userId = null, ?int $fieldId = null, ?float $lat = null, ?float $lng = null): ?array;

    /**
     * Market dashboard: highest/lowest/average price and market trends.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function marketDashboard(array $filters = []): array;

    /**
     * Pull normalized price records from an external provider (Agmarknet/eNAM/
     * state API) and persist them through the immutable ingest path. Controllers
     * never change when new providers are added.
     *
     * @param  array<string, mixed>  $filters
     */
    public function syncFromProvider(PriceDataProviderInterface $provider, array $filters = []): array;

    /**
     * Every active mandi.
     */
    public function activeMandis(): Collection;

    /**
     * Look up a mandi by its identifier.
     */
    public function findMandi(int $mandiId): ?Mandi;
}
