<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CropTimelineResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'cropId' => $this['crop_id'],
            'sowingDate' => $this['sowing_date'],
            'expectedHarvestDate' => $this['expected_harvest_date'],
            'durationDays' => $this['duration_days'],
            'daysSinceSowing' => $this['days_since_sowing'],
            'stages' => array_map(fn (array $stage): array => [
                'stage' => $stage['stage'],
                'dayStart' => $stage['day_start'],
                'dayEnd' => $stage['day_end'],
                'activity' => $stage['activity'],
                'startDate' => $stage['start_date'] ?? null,
                'endDate' => $stage['end_date'] ?? null,
                'isCurrent' => $stage['is_current'],
            ], $this['stages']),
        ];
    }
}
