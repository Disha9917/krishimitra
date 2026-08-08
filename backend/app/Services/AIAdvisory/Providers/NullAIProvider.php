<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory\Providers;

use App\Services\AIAdvisory\Contracts\AIProviderInterface;
use App\Services\AIAdvisory\DTO\AdvisoryContextDTO;
use App\Services\AIAdvisory\DTO\AdvisoryResponseDTO;

/**
 * Placeholder provider used until a real vendor is wired in. It never calls
 * an external AI service; it only acknowledges the structured context.
 */
class NullAIProvider implements AIProviderInterface
{
    public function name(): string
    {
        return 'null';
    }

    public function label(): string
    {
        return 'Null Provider (Placeholder)';
    }

    public function model(): string
    {
        return 'krishimitra-null-v1';
    }

    public function generate(string $prompt, AdvisoryContextDTO $context): AdvisoryResponseDTO
    {
        $started = hrtime(true);

        $content = $context->locale === 'gu'
            ? "AI સલાહ પાઇપલાઇન હજુ સક્રિય નથી.\n\nવિષય: {$context->topic}\nપ્રકાર: {$context->advisoryType}\n\nઆ placeholder પ્રતિસાદ છે — ભવિષ્યના તબક્કામાં અહીં વાસ્તવિક AI સલાહ પ્રદાન કરવામાં આવશે."
            : "The AI advisory pipeline is not yet active.\n\nTopic: {$context->topic}\nType: {$context->advisoryType}\n\nThis is a placeholder response — real AI advisory content will be provided in a future phase.";

        return AdvisoryResponseDTO::placeholder(
            provider: $this->name(),
            model: $this->model(),
            content: $content,
            latencyMs: (int) ((hrtime(true) - $started) / 1_000_000),
            raw: ['prompt_preview' => mb_substr($prompt, 0, 200)],
        );
    }
}
