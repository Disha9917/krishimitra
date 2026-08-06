<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CropSummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'totalCrops' => $this['total_crops'],
            'activeCrops' => $this['active_crops'],
            'plannedCrops' => $this['planned_crops'],
            'overdueCrops' => $this['overdue_crops'],
            'harvestedCrops' => $this['harvested_crops'],
            'deletedCrops' => $this['deleted_crops'],
            'bySeason' => $this['by_season'],
            'totalHarvestQuantityKg' => $this['total_harvest_quantity_kg'],
            'totalHarvestCount' => $this['total_harvest_count'],
            'averageYieldPerAcre' => $this['average_yield_per_acre'],
        ];
    }
}
