<?php

declare(strict_types=1);

namespace App\Http\Requests;

class GenerateWeatherAlertsRequest extends WeatherCoordinatesRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'districtId' => ['required', 'integer', 'exists:districts,id'],
        ]);
    }
}
