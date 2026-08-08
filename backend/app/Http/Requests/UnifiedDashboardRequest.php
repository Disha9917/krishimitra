<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UnifiedDashboardRequest extends FormRequest
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
            'sections' => ['nullable', 'string', 'regex:/^[a-z]+(,[a-z]+)*$/'],
            'refresh' => ['nullable', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $sections = $this->input('sections');

            if (!is_string($sections) || $sections === '') {
                return;
            }

            $known = config('dashboard.sections');

            foreach (explode(',', $sections) as $section) {
                if (!in_array($section, $known, true)) {
                    $validator->errors()->add('sections', sprintf('The selected section "%s" is invalid.', $section));
                }
            }
        });
    }
}
