<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\MarketPrice;
use Illuminate\Database\Eloquent\Collection;

interface MarketPriceRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * List price records applying crop/mandi/district/state/date filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function listPrices(array $filters = [], int $limit = 20): Collection;

    /**
     * Every price record between two dates (inclusive) applying filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function pricesBetween(string $from, string $to, array $filters = [], int $limit = 1000): Collection;

    /**
     * The most recent price date present for the given filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function latestPriceDate(array $filters = []): ?string;

    /**
     * The price record of a mandi/crop pair on a specific date (immutable records).
     */
    public function priceForDate(int $mandiId, int $cropId, string $date): ?MarketPrice;

    /**
     * Daily price records of a mandi/crop pair inside a date range, oldest first.
     */
    public function priceHistory(int $cropId, int $mandiId, string $from, string $to): Collection;
}
