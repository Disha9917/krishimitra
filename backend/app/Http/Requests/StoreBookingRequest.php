<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
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
            'startAt' => ['required', 'date_format:Y-m-d H:i:s'],
            'endAt' => ['required', 'date_format:Y-m-d H:i:s', 'after:startAt'],
            'location' => ['nullable', 'string', 'max:255'],
            'depositAmount' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
