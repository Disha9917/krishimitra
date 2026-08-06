<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WeatherSummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'locationKey' => $this['locationKey'],
            'temperatureC' => $this['temperatureC'],
            'feelsLikeC' => $this['feelsLikeC'],
            'condition' => $this['condition'],
            'humidityPct' => $this['humidityPct'],
            'windSpeedKmh' => $this['windSpeedKmh'],
            'uvIndex' => $this['uvIndex'],
            'rainfallMm' => $this['rainfallMm'],
            'sunriseAt' => $this['sunriseAt'],
            'sunsetAt' => $this['sunsetAt'],
            'summary' => $this['summary'],
        ];
    }
}
