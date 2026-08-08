<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory;

use App\Services\AIAdvisory\Contracts\PromptBuilderInterface;
use App\Services\AIAdvisory\DTO\AdvisoryContextDTO;

/**
 * Assembles a structured, vendor-neutral prompt from an advisory context.
 * Pure formatting — no AI or network calls happen here.
 */
class PromptBuilder implements PromptBuilderInterface
{
    public function build(AdvisoryContextDTO $context): string
    {
        $data = $context->toPromptData();

        $lines = [];
        $lines[] = 'You are KrishiMitra, an agricultural advisory assistant for farmers in Gujarat, India.';
        $lines[] = 'Answer in '.($data['locale'] === 'gu' ? 'Gujarati' : 'English').'.';
        $lines[] = 'Provide practical, actionable, region-appropriate advice only.';
        $lines[] = '';
        $lines[] = '## Advisory Request';
        $lines[] = '- Type: '.$data['advisory_type'];
        $lines[] = '- Topic: '.$data['topic'];
        $lines[] = '';

        if ($data['sections'] !== []) {
            $lines[] = '## Structured Context';

            foreach (array_slice($data['sections'], 0, (int) config('ai.prompt_max_context_sections')) as $section => $values) {
                $lines[] = '### '.$section;

                foreach ($values as $key => $value) {
                    $this->renderValue($lines, $key, $value, 0);
                }
            }

            $lines[] = '';
        }

        $lines[] = 'Give a clear, numbered recommendation list followed by do\'s and don\'ts.';
        $lines[] = 'If the topic cannot be answered safely, say so and suggest where the farmer can get help.';

        return implode("\n", $lines);
    }

    /**
     * Render one context value as a bullet line; nested arrays are rendered
     * recursively with increasing indentation so structured module data
     * (dashboards, forecast lists, eligibility reasons) reaches the prompt.
     *
     * @param  list<string>  $lines
     */
    private function renderValue(array &$lines, int|string $key, mixed $value, int $depth): void
    {
        $indent = str_repeat('  ', $depth);

        if (is_array($value)) {
            if ($value === []) {
                $lines[] = $indent.'- '.$key.': []';

                return;
            }

            $lines[] = $indent.'- '.$key.':';

            foreach ($value as $childKey => $childValue) {
                $this->renderValue($lines, is_int($childKey) ? $childKey : (string) $childKey, $childValue, $depth + 1);
            }

            return;
        }

        $label = is_string($key) ? $key.': ' : '- ';
        $lines[] = $indent.'- '.$label.$this->displayValue($value);
    }

    private function displayValue(mixed $value): string
    {
        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        if ($value === null) {
            return 'null';
        }

        return (string) $value;
    }
}
