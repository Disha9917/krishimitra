<?php

declare(strict_types=1);

namespace App\Http\Requests;

class WeatherDashboardRequest extends WeatherCoordinatesRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'districtId' => ['sometimes', 'nullable', 'integer', 'exists:districts,id'],
        ]);
    }
}
