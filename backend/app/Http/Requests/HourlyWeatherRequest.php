<?php

declare(strict_types=1);

namespace App\Http\Requests;

class HourlyWeatherRequest extends WeatherCoordinatesRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'hours' => ['sometimes', 'integer', 'between:1,168'],
        ]);
    }
}
