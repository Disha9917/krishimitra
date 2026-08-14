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
        $lines[] = 'You are FasalDrishti, an agricultural advisory assistant for farmers in Gujarat, India.';
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

        $lines[] = '## Strict JSON Output Contract';
        $lines[] = 'Return ONLY one valid JSON object. Never return markdown, code fences, or explanations outside JSON.';
        $lines[] = 'Every field must follow this exact schema. Use only data present in the structured context; never invent numbers, prices, schemes or locations.';
        $lines[] = '';
        $lines[] = '{';
        $lines[] = '  "summary": "Executive summary of the whole advisory (2-4 sentences)",';
        $lines[] = '  "riskLevel": "Low" | "Medium" | "High",';
        $lines[] = '  "confidence": number between 0 and 1,';
        $lines[] = '  "sevenDayPlan": [';
        $lines[] = '    {';
        $lines[] = '      "day": 1,';
        $lines[] = '      "date": "YYYY-MM-DD",';
        $lines[] = '      "focus": "Main focus of this day",';
        $lines[] = '      "actions": ["Action for the day"],';
        $lines[] = '      "weatherNotes": "How weather affects today\'s work"';
        $lines[] = '    }';
        $lines[] = '  ],';
        $lines[] = '  "recommendations": {';
        $lines[] = '    "weather": { "summary": "string", "actions": ["string"] },';
        $lines[] = '    "soil": { "summary": "string", "actions": ["string"] },';
        $lines[] = '    "crop": { "summary": "string", "actions": ["string"] },';
        $lines[] = '    "disease": { "summary": "string", "actions": ["string"] },';
        $lines[] = '    "market": { "summary": "string", "actions": ["string"] },';
        $lines[] = '    "schemes": { "summary": "string", "actions": ["string"] },';
        $lines[] = '    "equipment": { "summary": "string", "actions": ["string"] },';
        $lines[] = '    "storage": { "summary": "string", "actions": ["string"] },';
        $lines[] = '    "transport": { "summary": "string", "actions": ["string"] }';
        $lines[] = '  },';
        $lines[] = '  "priorityTasks": [';
        $lines[] = '    { "task": "What to do", "reason": "Why it matters", "priority": "High" | "Medium" | "Low" }';
        $lines[] = '  ],';
        $lines[] = '  "avoid": [';
        $lines[] = '    { "action": "What NOT to do", "reason": "Why to avoid it" }';
        $lines[] = '  ]';
        $lines[] = '}';
        $lines[] = '';
        $lines[] = 'Only include the nine recommendation modules when you have real supporting data in the context.';
        $lines[] = 'When a module has no supporting data, omit its key entirely. Never fill a module with guesses.';
        $lines[] = 'Use the "avoid" list for dangerous or wasteful practices. If the topic cannot be answered safely, say so in "summary" and suggest where the farmer can get help.';

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
