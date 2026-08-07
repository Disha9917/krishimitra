<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SunTimesResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'locationKey' => $this['locationKey'],
            'sunriseAt' => $this['sunriseAt'],
            'sunsetAt' => $this['sunsetAt'],
            'daylightHours' => $this['daylightHours'],
        ];
    }
}
