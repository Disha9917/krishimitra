<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SoilHealthResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'fieldId' => $this['field_id'],
            'hasData' => $this['has_data'],
            'latestTestId' => $this['latest_test_id'] ?? null,
            'sampledOn' => $this['sampled_on'] ?? null,
            'healthScore' => $this['health_score'] ?? null,
            'soilStatus' => $this['soil_status'] ?? null,
            'fertilityLevel' => $this['fertility_level'] ?? null,
            'nutrientSummary' => $this['nutrient_summary'] ?? [],
            'alerts' => $this['alerts'] ?? [],
        ];
    }
}
