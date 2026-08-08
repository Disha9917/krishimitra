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
        return [
            'type' => 'object',
            'properties' => [
                'summary' => ['type' => 'string'],
                'riskLevel' => ['type' => 'string', 'enum' => ['Low', 'Medium', 'High']],
                'confidence' => ['type' => 'number', 'minimum' => 0, 'maximum' => 1],
                'recommendations' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'title' => ['type' => 'string'],
                            'description' => ['type' => 'string'],
                            'priority' => ['type' => 'string', 'enum' => ['High', 'Medium', 'Low']],
                            'category' => [
                                'type' => 'string',
                                'enum' => ['Weather', 'Soil', 'Crop', 'Disease', 'Market', 'Government', 'Equipment', 'Transport', 'Storage'],
                            ],
                        ],
                        'required' => ['title', 'description', 'priority', 'category'],
                    ],
                ],
                'alerts' => ['type' => 'array'],
                'bestMarket' => ['type' => 'object'],
                'eligibleSchemes' => ['type' => 'array'],
                'nextReviewDate' => ['type' => 'string'],
            ],
            'required' => ['summary', 'riskLevel', 'confidence', 'recommendations'],
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
