<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MarketDashboardRequest extends FormRequest
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
            'cropId' => ['sometimes', 'nullable', 'integer', 'exists:crops,id'],
            'mandiId' => ['sometimes', 'nullable', 'integer', 'exists:mandis,id'],
            'districtId' => ['sometimes', 'nullable', 'integer', 'exists:districts,id'],
            'state' => ['sometimes', 'nullable', 'string', 'max:50'],
        ];
    }
}
