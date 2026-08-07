<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'fullName' => ['sometimes', 'string', 'max:150'],
            'preferredLanguage' => ['sometimes', 'in:gu,hi,en'],
            'farmSizeAcres' => ['sometimes', 'numeric', 'min:0.01', 'max:100000'],
            'primaryCropId' => ['sometimes', 'nullable', 'integer', 'exists:crops,id'],
            'pinCode' => ['sometimes', 'regex:/^[1-9][0-9]{5}$/'],
            'state' => ['sometimes', 'nullable', 'string', 'max:50'],
            'districtId' => ['sometimes', 'nullable', 'integer', 'exists:districts,id'],
            'talukaId' => ['sometimes', 'nullable', 'integer', 'exists:talukas,id'],
            'village' => ['sometimes', 'nullable', 'string', 'max:150'],
            'alertPreferences' => ['sometimes', 'array'],
            'alertPreferences.smsEnabled' => ['sometimes', 'boolean'],
            'alertPreferences.whatsappEnabled' => ['sometimes', 'boolean'],
            'alertPreferences.priceThresholdAlerts' => ['sometimes', 'boolean'],
            'alertPreferences.diseaseAlerts' => ['sometimes', 'boolean'],
            'alertPreferences.weatherAlerts' => ['sometimes', 'boolean'],
            'alertPreferences.minPriceThresholdINR' => ['sometimes', 'numeric', 'min:0'],
        ];
    }
}
