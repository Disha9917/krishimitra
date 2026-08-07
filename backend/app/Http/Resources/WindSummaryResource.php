<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WindSummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'locationKey' => $this['locationKey'],
            'currentSpeedKmh' => $this['currentSpeedKmh'],
            'currentDirection' => $this['currentDirection'],
            'forecastMaxKmh' => $this['forecastMaxKmh'],
            'maxDay' => $this['maxDay'],
            'averageKmh' => $this['averageKmh'],
        ];
    }
}
