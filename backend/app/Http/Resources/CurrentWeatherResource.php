<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CurrentWeatherResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'locationKey' => $this['locationKey'],
            'source' => $this['source'],
            'temperatureC' => $this['temperatureC'],
            'feelsLikeC' => $this['feelsLikeC'],
            'humidityPct' => $this['humidityPct'],
            'rainfallMm' => $this['rainfallMm'],
            'windSpeedKmh' => $this['windSpeedKmh'],
            'windDirection' => $this['windDirection'],
            'condition' => $this['condition'],
            'uvIndex' => $this['uvIndex'],
            'airQualityIndex' => $this['airQualityIndex'],
            'sunriseAt' => $this['sunriseAt'],
            'sunsetAt' => $this['sunsetAt'],
            'observedAt' => $this['observedAt'],
            'cachedAt' => $this['cachedAt'],
        ];
    }
}
