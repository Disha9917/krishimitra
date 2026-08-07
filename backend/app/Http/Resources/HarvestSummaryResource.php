<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HarvestSummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'cropId' => $this['crop_id'],
            'harvestCount' => $this['harvest_count'],
            'totalQuantityKg' => $this['total_quantity_kg'],
            'averageYieldPerAcre' => $this['average_yield_per_acre'],
        ];
    }
}
