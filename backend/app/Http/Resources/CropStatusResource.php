<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CropStatusResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'cropId' => $this['crop_id'],
            'status' => $this['status'],
            'statusLabel' => $this['status_label'],
            'sowingDate' => $this['sowing_date'],
            'expectedHarvestDate' => $this['expected_harvest_date'],
            'isOverdue' => $this['is_overdue'],
            'harvestCount' => $this['harvest_count'],
        ];
    }
}
