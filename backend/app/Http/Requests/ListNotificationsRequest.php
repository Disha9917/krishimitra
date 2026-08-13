<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListNotificationsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'type' => ['nullable', 'string', 'in:WEATHER_ALERT,DISEASE_ALERT,MARKET_ALERT,GOVERNMENT_SCHEME,EQUIPMENT_BOOKING,COLD_STORAGE_BOOKING,TRANSPORT_BOOKING,AI_ADVISORY,SYSTEM,PRICE,DISEASE,WEATHER,ADVISORY'],
            'isRead' => ['nullable', 'boolean'],
            'perPage' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
