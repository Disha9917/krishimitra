<?php

declare(strict_types=1);

namespace App\Http\Requests\AI;

use Illuminate\Foundation\Http\FormRequest;

class HistoryRequest extends FormRequest
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
            'advisory_type' => ['nullable', 'string', 'max:50'],
            'crop' => ['nullable', 'string', 'max:100'],
            'field' => ['nullable', 'string', 'max:100'],
            'district' => ['nullable', 'string', 'max:100'],
            'risk_level' => ['nullable', 'string', 'in:Low,Medium,High,low,medium,high'],
            'provider' => ['nullable', 'string', 'max:50'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
            'keyword' => ['nullable', 'string', 'max:255'],
            'favorites' => ['nullable', 'in:true,false,1,0'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function filters(): array
    {
        $filters = $this->validated();

        if (isset($filters['risk_level'])) {
            $filters['risk_level'] = ucfirst(strtolower((string) $filters['risk_level']));
        }

        $filters['favorites'] = filter_var($filters['favorites'] ?? false, FILTER_VALIDATE_BOOL);

        return $filters;
    }
}
