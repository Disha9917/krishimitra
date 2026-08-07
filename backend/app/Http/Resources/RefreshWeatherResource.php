<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RefreshWeatherResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'locationKey' => $this['locationKey'],
            'source' => $this['source'],
            'current' => $this['current'],
            'forecast' => $this['forecast'],
            'hourly' => $this['hourly'],
        ];
    }
}
