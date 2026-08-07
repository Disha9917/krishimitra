<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CropGrowthResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'cropId' => $this['crop_id'],
            'stage' => $this['stage'],
            'stageLabel' => $this['stage_label'],
            'progressPercent' => $this['progress_percent'],
            'daysSinceSowing' => $this['days_since_sowing'],
            'durationDays' => $this['duration_days'],
            'nextStage' => $this['next_stage'],
        ];
    }
}
