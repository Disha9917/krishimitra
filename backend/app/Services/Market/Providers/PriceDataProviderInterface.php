<?php

declare(strict_types=1);

namespace App\Services\Market\Providers;

/**
 * Contract for external price data sources (Agmarknet, eNAM, state APMC APIs).
 *
 * A provider returns normalized records that MarketService::ingestPrice()
 * can persist unchanged — plugging a new source in never touches controllers.
 */
interface PriceDataProviderInterface
{
    /**
     * Fetch normalized price records.
     *
     * @param  array<string, mixed>  $filters  e.g. state, district, crop, date
     * @return list<array<string, mixed>> normalized records:
     *                                    mandi_id, crop_id, price_date, min_price,
     *                                    max_price, todays_price, unit, source
     */
    public function fetch(array $filters = []): array;
}
