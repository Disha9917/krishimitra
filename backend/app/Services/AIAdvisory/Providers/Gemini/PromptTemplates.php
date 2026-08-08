<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory\Providers\Gemini;

/**
 * System-level instructions for the Gemini provider. The user-facing prompt
 * is owned by PromptBuilder; this class only defines the model's role and
 * the strict JSON output contract, which are appended as the API's
 * systemInstruction - no prompt logic is duplicated.
 */
class PromptTemplates
{
    /**
     * The exact JSON shape the model must return. Parsed and validated by
     * ResponseParser before anything is persisted.
     *
     * @return array<string, mixed>
     */
    public static function expectedJsonSchema(): array
    {
        $moduleRecommendation = [
            'type' => 'object',
            'properties' => [
                'summary' => ['type' => 'string'],
                'actions' => [
                    'type' => 'array',
                    'items' => ['type' => 'string'],
                ],
            ],
            'additionalProperties' => true,
        ];

        return [
            'type' => 'object',
            'properties' => [
                'summary' => ['type' => 'string'],
                'riskLevel' => ['type' => 'string', 'enum' => ['Low', 'Medium', 'High']],
                'confidence' => ['type' => 'number', 'minimum' => 0, 'maximum' => 1],
                'sevenDayPlan' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'day' => ['type' => 'integer', 'minimum' => 1],
                            'date' => ['type' => 'string'],
                            'focus' => ['type' => 'string'],
                            'actions' => ['type' => 'array', 'items' => ['type' => 'string']],
                            'weatherNotes' => ['type' => 'string'],
                        ],
                        'required' => ['day', 'date', 'focus', 'actions'],
                    ],
                ],
                'recommendations' => [
                    'type' => 'object',
                    'properties' => [
                        'weather' => $moduleRecommendation,
                        'soil' => $moduleRecommendation,
                        'crop' => $moduleRecommendation,
                        'disease' => $moduleRecommendation,
                        'market' => $moduleRecommendation,
                        'schemes' => $moduleRecommendation,
                        'equipment' => $moduleRecommendation,
                        'storage' => $moduleRecommendation,
                        'transport' => $moduleRecommendation,
                    ],
                    'additionalProperties' => true,
                ],
                'priorityTasks' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'task' => ['type' => 'string'],
                            'reason' => ['type' => 'string'],
                            'priority' => ['type' => 'string', 'enum' => ['High', 'Medium', 'Low']],
                        ],
                        'required' => ['task', 'reason', 'priority'],
                    ],
                ],
                'avoid' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'action' => ['type' => 'string'],
                            'reason' => ['type' => 'string'],
                        ],
                        'required' => ['action', 'reason'],
                    ],
                ],
            ],
            'required' => ['summary', 'riskLevel', 'confidence', 'sevenDayPlan', 'recommendations', 'priorityTasks', 'avoid'],
        ];
    }

    public static function systemInstruction(string $locale): string
    {
        $language = $locale === 'gu'
            ? 'The advisory content (summary, recommendation titles and descriptions, alert messages) must be written in Gujarati. Field names, riskLevel, priority and category values must stay in English as defined by the schema.'
            : 'Write the advisory content (summary, recommendation titles and descriptions, alert messages) in clear, simple English.';

        $schema = json_encode(self::expectedJsonSchema(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        return 'You are an Agricultural Expert for Indian Farmers, specialising in Gujarat agriculture. '
            .'You answer only within the structured context provided by the system; you never invent data that is absent from the context. '
            .$language.' '
            .'Return ONLY valid JSON. Never return markdown. Never return explanations outside JSON. '
            .'Follow this exact JSON schema, omitting optional keys when there is no data, and never adding keys outside the schema:'
            ."\n\n".$schema;
    }
}
