<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListSchemesRequest extends FormRequest
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
            'category' => ['sometimes', 'nullable', 'string', 'max:80'],
            'state' => ['sometimes', 'nullable', 'string', 'max:50'],
            'districtId' => ['sometimes', 'nullable', 'integer', 'exists:districts,id'],
            'cropId' => ['sometimes', 'nullable', 'integer', 'exists:crops,id'],
            'search' => ['sometimes', 'nullable', 'string', 'max:100'],
            'limit' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:500'],
        ];
    }
}
