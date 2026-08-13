<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMarketPriceRequest extends FormRequest
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
            'mandiId' => ['required', 'integer', 'exists:mandis,id'],
            'cropId' => ['required', 'integer', 'exists:crops,id'],
            'priceDate' => ['required', 'date'],
            'minPrice' => ['required', 'numeric', 'min:0'],
            'maxPrice' => ['required', 'numeric', 'gte:minPrice'],
            'todaysPrice' => ['required', 'numeric', 'gte:minPrice', 'lte:maxPrice'],
            'unit' => ['sometimes', 'string', 'max:20'],
            'source' => ['sometimes', 'string', 'in:agmarknet,enam,state_api,manual'],
        ];
    }
}
