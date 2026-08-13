<?php

declare(strict_types=1);

namespace App\Http\Requests\AI;

use Illuminate\Foundation\Http\FormRequest;

class FeedbackRequest extends FormRequest
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
            'rating' => ['required', 'integer', 'between:1,5'],
            'helpful' => ['required', 'boolean'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array{rating: int, helpful: bool, comment: string}
     */
    public function feedback(): array
    {
        return [
            'rating' => (int) $this->validated('rating'),
            'helpful' => (bool) $this->boolean('helpful'),
            'comment' => (string) ($this->validated('comment') ?? ''),
        ];
    }
}
