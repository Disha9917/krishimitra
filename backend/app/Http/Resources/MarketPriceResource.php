<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\MarketPrice;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin MarketPrice */
class MarketPriceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'mandi' => $this->mandi !== null ? [
                'id' => (int) $this->mandi->id,
                'name' => $this->mandi->name,
                'state' => $this->mandi->state,
                'district' => $this->mandi->district?->name,
            ] : null,
            'crop' => $this->crop !== null ? [
                'id' => (int) $this->crop->id,
                'name' => $this->crop->name,
                'nameGujarati' => $this->crop->name_gujarati,
            ] : null,
            'priceDate' => $this->price_date?->toDateString(),
            'minPrice' => $this->min_price !== null ? (float) $this->min_price : null,
            'maxPrice' => $this->max_price !== null ? (float) $this->max_price : null,
            'todaysPrice' => $this->todays_price !== null ? (float) $this->todays_price : null,
            'changePct' => $this->change_pct !== null ? (float) $this->change_pct : null,
            'trend' => $this->trend,
            'unit' => $this->unit,
            'source' => $this->source,
            'ingestedAt' => $this->ingested_at?->toIso8601String(),
        ];
    }
}
