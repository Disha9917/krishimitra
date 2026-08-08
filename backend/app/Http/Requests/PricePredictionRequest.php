<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PricePredictionRequest extends FormRequest
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
            'cropId' => ['required', 'integer', 'exists:crops,id'],
            'mandiId' => ['sometimes', 'nullable', 'integer', 'exists:mandis,id'],
            'period' => ['sometimes', 'integer', 'min:1', 'max:30'],
        ];
    }
}
