<?php

declare(strict_types=1);

namespace App\Http\Requests;

class WeatherHistoryRequest extends WeatherCoordinatesRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'days' => ['sometimes', 'integer', 'between:1,30'],
        ]);
    }
}
