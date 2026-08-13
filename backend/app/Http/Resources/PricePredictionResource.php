<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PricePredictionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'hasPrediction' => $this['has_prediction'],
            'reason' => $this['reason'] ?? null,
            'message' => $this['message'] ?? null,
            'cropId' => $this['crop_id'],
            'mandiId' => $this['mandi_id'],
            'periodDays' => $this['period_days'] ?? null,
            'trend' => $this['trend'] ?? null,
            'changePct' => $this['change_pct'] ?? null,
            'indicator' => $this['indicator'] ?? null,
            'currentPrice' => $this['current_price'] ?? null,
            'averagePrice' => $this['average_price'] ?? null,
            'predictedPrices' => $this['predicted_prices'] ?? [],
            'confidence' => $this['confidence'] ?? null,
            'generatedAt' => $this['generated_at'] ?? null,
            'validUntil' => $this['valid_until'] ?? null,
            'modelVersion' => $this['model_version'] ?? null,
        ];
    }
}
