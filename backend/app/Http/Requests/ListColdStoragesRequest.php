<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListColdStoragesRequest extends FormRequest
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
            'districtId' => ['sometimes', 'nullable', 'integer', 'exists:districts,id'],
            'talukaId' => ['sometimes', 'nullable', 'integer', 'exists:talukas,id'],
            'villageId' => ['sometimes', 'nullable', 'integer', 'exists:villages,id'],
            'cropId' => ['sometimes', 'nullable', 'integer', 'exists:crops,id'],
            'minPrice' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'maxPrice' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'minTemp' => ['sometimes', 'nullable', 'numeric', 'between:-50,60'],
            'maxTemp' => ['sometimes', 'nullable', 'numeric', 'between:-50,60'],
            'hasCapacity' => ['sometimes', 'nullable', 'boolean'],
            'search' => ['sometimes', 'nullable', 'string', 'max:100'],
            'limit' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
