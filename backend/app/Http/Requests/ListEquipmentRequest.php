<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListEquipmentRequest extends FormRequest
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
            'equipmentType' => ['sometimes', 'nullable', 'string', 'max:30'],
            'category' => ['sometimes', 'nullable', 'string', 'max:30'],
            'districtId' => ['sometimes', 'nullable', 'integer', 'exists:districts,id'],
            'talukaId' => ['sometimes', 'nullable', 'integer', 'exists:talukas,id'],
            'villageId' => ['sometimes', 'nullable', 'integer', 'exists:villages,id'],
            'availability' => ['sometimes', 'nullable', 'boolean'],
            'minPrice' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'maxPrice' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'minRating' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:5'],
            'ownerId' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'search' => ['sometimes', 'nullable', 'string', 'max:100'],
            'limit' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
