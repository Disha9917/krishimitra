<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RainPredictionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'locationKey' => $this['locationKey'],
            'source' => $this['source'],
            'days' => $this['days'],
            'maxProbabilityPct' => $this['maxProbabilityPct'],
            'maxDay' => $this['maxDay'],
            'rainExpected' => $this['rainExpected'],
            'averageProbabilityPct' => $this['averageProbabilityPct'],
        ];
    }
}
