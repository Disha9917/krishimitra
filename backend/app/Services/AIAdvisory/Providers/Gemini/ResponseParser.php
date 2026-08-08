<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory\Providers\Gemini;

use JsonException;

/**
 * Validates and normalizes the Gemini JSON payload into the canonical
 * advisory shape. Malformed or empty input yields null so the provider can
 * retry once and finally fall back to a safe response - the advisory flow
 * never crashes on bad model output.
 */
class ResponseParser
{
    private const RISK_LEVELS = ['Low', 'Medium', 'High'];

    private const PRIORITIES = ['Low', 'Medium', 'High'];

    private const CATEGORIES = ['Weather', 'Soil', 'Crop', 'Disease', 'Market', 'Government', 'Equipment', 'Transport', 'Storage'];

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
        $recommendations = [];

        foreach ($this->asList($payload['recommendations'] ?? []) as $recommendation) {
            if (is_array($recommendation)) {
                $recommendations[] = $this->normalizeRecommendation($recommendation);
            }
        }

        $riskLevel = (string) ($payload['riskLevel'] ?? 'Low');
        $confidence = (float) ($payload['confidence'] ?? 0.0);

        return [
            'summary' => (string) ($payload['summary'] ?? ''),
            'riskLevel' => in_array($riskLevel, self::RISK_LEVELS, true) ? $riskLevel : 'Low',
            'confidence' => max(0.0, min(1.0, $confidence)),
            'recommendations' => $recommendations,
            'alerts' => $this->normalizeAlerts($this->asList($payload['alerts'] ?? [])),
            'bestMarket' => $this->asMap($payload['bestMarket'] ?? null),
            'eligibleSchemes' => $this->asList($payload['eligibleSchemes'] ?? []),
            'nextReviewDate' => (string) ($payload['nextReviewDate'] ?? ''),
        ];
    }

    /**
     * @param  array<string, mixed>  $recommendation
     * @return array<string, mixed>
     */
    private function normalizeRecommendation(array $recommendation): array
    {
        $priority = (string) ($recommendation['priority'] ?? 'Medium');
        $category = (string) ($recommendation['category'] ?? 'Crop');

        return [
            'title' => (string) ($recommendation['title'] ?? ''),
            'description' => (string) ($recommendation['description'] ?? ''),
            'priority' => in_array($priority, self::PRIORITIES, true) ? $priority : 'Medium',
            'category' => in_array($category, self::CATEGORIES, true) ? $category : 'Crop',
        ];
    }

    /**
     * @param  list<mixed>  $alerts
     * @return list<array<string, mixed>>
     */
    private function normalizeAlerts(array $alerts): array
    {
        $normalized = [];

        foreach ($alerts as $alert) {
            if (is_array($alert)) {
                $normalized[] = [
                    'title' => (string) ($alert['title'] ?? ''),
                    'message' => (string) ($alert['message'] ?? ''),
                    'severity' => (string) ($alert['severity'] ?? 'Info'),
                ];
            }
        }

        return $normalized;
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
