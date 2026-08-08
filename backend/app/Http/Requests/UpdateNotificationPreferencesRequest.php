<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNotificationPreferencesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'weatherAlerts' => ['nullable', 'boolean'],
            'diseaseAlerts' => ['nullable', 'boolean'],
            'marketAlerts' => ['nullable', 'boolean'],
            'governmentSchemeAlerts' => ['nullable', 'boolean'],
            'equipmentAlerts' => ['nullable', 'boolean'],
            'coldStorageAlerts' => ['nullable', 'boolean'],
            'transportAlerts' => ['nullable', 'boolean'],
            'aiAdvisoryAlerts' => ['nullable', 'boolean'],
            'systemAlerts' => ['nullable', 'boolean'],
            'emailEnabled' => ['nullable', 'boolean'],
        ];
    }
}
