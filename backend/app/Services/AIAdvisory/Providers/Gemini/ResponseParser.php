<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory\Providers\Gemini;

use JsonException;

/**
 * Validates and normalizes the Gemini JSON payload into the canonical
 * advisory shape: summary, riskLevel, confidence, sevenDayPlan, the
 * nine-module recommendations map, priorityTasks and avoid list. Malformed
 * or empty input yields null so the provider can retry once and finally fall
 * back to a safe response - the advisory flow never crashes on bad model
 * output. Legacy list-shaped recommendations are folded into the module map.
 */
class ResponseParser
{
    private const RISK_LEVELS = ['Low', 'Medium', 'High'];

    private const PRIORITIES = ['Low', 'Medium', 'High'];

    private const MODULES = ['weather', 'soil', 'crop', 'disease', 'market', 'schemes', 'equipment', 'storage', 'transport'];

    private const LEGACY_CATEGORY_TO_MODULE = [
        'Weather' => 'weather',
        'Soil' => 'soil',
        'Crop' => 'crop',
        'Disease' => 'disease',
        'Market' => 'market',
        'Government' => 'schemes',
        'Equipment' => 'equipment',
        'Storage' => 'storage',
        'Transport' => 'transport',
    ];

    /**
     * @return array<string, mixed>|null
     */
    public function parse(string $text): ?array
    {
        $decoded = $this->decodeJson($text);

        if ($decoded === null) {
            return null;
        }

        return $this->normalize($decoded);
    }

    /**
     * @return array<string, mixed>|null
     */
    private function decodeJson(string $text): ?array
    {
        $candidate = $this->extractJson($text);

        if ($candidate === null) {
            return null;
        }

        try {
            $decoded = json_decode($candidate, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            return null;
        }

        return is_array($decoded) ? $decoded : null;
    }

    /**
     * Extract the outermost JSON object from a raw model response. Tolerates
     * surrounding prose and ```json code fences.
     */
    private function extractJson(string $text): ?string
    {
        $text = trim($text);

        if ($text === '') {
            return null;
        }

        $start = strpos($text, '{');

        if ($start === false) {
            return null;
        }

        $end = strrpos($text, '}');

        if ($end === false || $end <= $start) {
            return null;
        }

        return substr($text, $start, $end - $start + 1);
    }

    /**
     * Coerce the decoded payload into the canonical advisory schema, filling
     * defaults for missing or mistyped fields.
     *
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function normalize(array $payload): array
    {
        $riskLevel = (string) ($payload['riskLevel'] ?? 'Low');
        $confidence = (float) ($payload['confidence'] ?? 0.0);

        return [
            'summary' => (string) ($payload['summary'] ?? ''),
            'riskLevel' => in_array($riskLevel, self::RISK_LEVELS, true) ? $riskLevel : 'Low',
            'confidence' => round(max(0.0, min(1.0, $confidence)), 4),
            'sevenDayPlan' => $this->normalizeSevenDayPlan($payload['sevenDayPlan'] ?? []),
            'recommendations' => $this->normalizeRecommendations($payload['recommendations'] ?? []),
            'priorityTasks' => $this->normalizePriorityTasks($payload['priorityTasks'] ?? []),
            'avoid' => $this->normalizeAvoid($payload['avoid'] ?? []),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function normalizeSevenDayPlan(mixed $plan): array
    {
        $normalized = [];

        foreach ($this->asList($plan) as $day) {
            if (! is_array($day)) {
                continue;
            }

            $normalized[] = [
                'day' => (int) ($day['day'] ?? 0),
                'date' => (string) ($day['date'] ?? ''),
                'focus' => (string) ($day['focus'] ?? ''),
                'actions' => $this->stringList($day['actions'] ?? []),
                'weatherNotes' => (string) ($day['weatherNotes'] ?? ''),
            ];
        }

        usort($normalized, fn (array $a, array $b): int => $a['day'] <=> $b['day']);

        return $normalized;
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    private function normalizeRecommendations(mixed $recommendations): array
    {
        $normalized = [];

        foreach ($this->asMap($recommendations) as $module => $content) {
            $key = strtolower((string) $module);

            if (in_array($key, self::MODULES, true) && is_array($content)) {
                $normalized[$key] = $this->normalizeModule($content);
            }
        }

        foreach ($this->asList($recommendations) as $legacy) {
            if (! is_array($legacy)) {
                continue;
            }

            $category = (string) ($legacy['category'] ?? '');
            $module = self::LEGACY_CATEGORY_TO_MODULE[$category] ?? null;

            if ($module === null) {
                continue;
            }

            $entry = $this->normalizeModule($legacy);
            $current = $normalized[$module] ?? ['summary' => '', 'actions' => []];

            if ($entry['summary'] !== '') {
                $current['summary'] = $current['summary'] !== ''
                    ? $current['summary'].' '.$entry['summary']
                    : $entry['summary'];
            }

            $current['actions'] = [...$current['actions'], ...$entry['actions']];
            $normalized[$module] = $current;
        }

        return $normalized;
    }

    /**
     * @param  array<string, mixed>  $content
     * @return array<string, mixed>
     */
    private function normalizeModule(array $content): array
    {
        $summary = (string) ($content['summary'] ?? '');
        $summary = $summary !== '' ? $summary : (string) ($content['title'] ?? '');

        $actions = $this->stringList($content['actions'] ?? []);

        if ($actions === [] && isset($content['description'])) {
            $actions = [(string) $content['description']];
        }

        $normalized = [
            'summary' => $summary,
            'actions' => $actions,
        ];

        foreach ($content as $key => $value) {
            if (! in_array($key, ['summary', 'actions', 'title', 'description'], true)) {
                $normalized[$key] = $value;
            }
        }

        return $normalized;
    }

    /**
     * @return list<array<string, string>>
     */
    private function normalizePriorityTasks(mixed $tasks): array
    {
        $normalized = [];

        foreach ($this->asList($tasks) as $task) {
            if (! is_array($task)) {
                continue;
            }

            $priority = (string) ($task['priority'] ?? 'Medium');

            $normalized[] = [
                'task' => (string) ($task['task'] ?? ''),
                'reason' => (string) ($task['reason'] ?? ''),
                'priority' => in_array($priority, self::PRIORITIES, true) ? $priority : 'Medium',
            ];
        }

        return $normalized;
    }

    /**
     * @return list<array<string, string>>
     */
    private function normalizeAvoid(mixed $avoid): array
    {
        $normalized = [];

        foreach ($this->asList($avoid) as $item) {
            if (is_string($item)) {
                $normalized[] = ['action' => $item, 'reason' => ''];

                continue;
            }

            if (is_array($item)) {
                $normalized[] = [
                    'action' => (string) ($item['action'] ?? ''),
                    'reason' => (string) ($item['reason'] ?? ''),
                ];
            }
        }

        return $normalized;
    }

    /**
     * @return list<string>
     */
    private function stringList(mixed $value): array
    {
        $strings = [];

        foreach ($this->asList($value) as $item) {
            if (is_string($item) && trim($item) !== '') {
                $strings[] = $item;
            }
        }

        return $strings;
    }

    /**
     * @return list<mixed>
     */
    private function asList(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        return array_is_list($value) ? $value : array_values($value);
    }

    /**
     * @return array<string, mixed>
     */
    private function asMap(mixed $value): array
    {
        if (! is_array($value) || array_is_list($value)) {
            return [];
        }

        return $value;
    }
}
