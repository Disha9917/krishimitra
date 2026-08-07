<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WeatherDashboardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'locationKey' => $this['locationKey'],
            'current' => $this['current'],
            'todayForecast' => $this['todayForecast'],
            'alerts' => $this['alerts'],
            'summary' => $this['summary'],
        ];
    }
}
