<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BestSellingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $basis = $this['basis'] ?? [];

        return [
            'crop' => $this['crop'],
            'mandi' => $this['mandi'],
            'expectedPrice' => $this['expected_price'],
            'unit' => $this['unit'],
            'estimatedDistanceKm' => $this['estimated_distance_km'],
            'suggestedSellingTime' => $this['suggested_selling_time'],
            'basis' => [
                'priceDate' => $basis['price_date'] ?? null,
                'trend' => $basis['trend'] ?? null,
                'changePct' => $basis['change_pct'] ?? null,
            ],
        ];
    }
}
