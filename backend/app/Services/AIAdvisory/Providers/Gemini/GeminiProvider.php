<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory\Providers\Gemini;

use App\Services\AIAdvisory\Contracts\AIProviderInterface;
use App\Services\AIAdvisory\DTO\AdvisoryContextDTO;
use App\Services\AIAdvisory\DTO\AdvisoryResponseDTO;
use App\Services\AIAdvisory\Providers\Gemini\Exceptions\GeminiException;
use Carbon\CarbonImmutable;
use Throwable;

/**
 * Enterprise Gemini provider. Pipeline: build payload from the existing
 * PromptBuilder output, append the system instruction, call the API through
 * GeminiClient with bounded retries, validate the JSON through
 * ResponseParser, and degrade to a safe fallback instead of crashing on any
 * timeout, 429/5xx, network failure, malformed or empty response.
 */
class GeminiProvider implements AIProviderInterface
{
    public function __construct(
        private readonly GeminiClient $client,
        private readonly ResponseParser $parser,
        private readonly RetryHandler $retryHandler,
    ) {}

    public function name(): string
    {
        return 'gemini';
    }

    public function label(): string
    {
        return 'Google Gemini';
    }

    public function model(): string
    {
        return $this->client->model();
    }

    public function generate(string $prompt, AdvisoryContextDTO $context): AdvisoryResponseDTO
    {
        $started = hrtime(true);

        if (! $this->client->hasApiKey()) {
            return $this->fallback($context, $started, 'Gemini API key is not configured.');
        }

        $systemInstruction = PromptTemplates::systemInstruction($context->locale);

        try {
            $attempt = $this->retryHandler->retry(
                fn (): ?array => $this->attempt($prompt, $systemInstruction),
            );
        } catch (GeminiException $e) {
            return $this->fallback($context, $started, $e->getMessage());
        } catch (Throwable $e) {
            return $this->fallback($context, $started, 'Unexpected AI failure: '.$e->getMessage());
        }

        if ($attempt === null) {
            return $this->fallback($context, $started, 'Gemini returned no usable response after retries.');
        }

        return new AdvisoryResponseDTO(
            content: json_encode($attempt['payload'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
            provider: $this->name(),
            model: $this->model(),
            usage: $this->normalizeUsage($attempt['usage']),
            latencyMs: $this->latencyMs($started),
            createdAt: CarbonImmutable::now(),
            raw: ['attempts' => $this->retryHandler->attemptsUsed()],
        );
    }

    /**
     * One generation attempt: call the API, extract the text candidate and
     * validate it. Returns null (retried by RetryHandler) on empty output or
     * malformed JSON; transient HTTP/network errors surface as
     * RetryableGeminiException from the client.
     *
     * @return array{payload: array<string, mixed>, usage: array<string, mixed>}|null
     */
    private function attempt(string $prompt, string $systemInstruction): ?array
    {
        $raw = $this->client->generate($prompt, $systemInstruction);
        $text = $raw['candidates'][0]['content']['parts'][0]['text'] ?? null;

        if ($text === null || trim((string) $text) === '') {
            return null;
        }

        $payload = $this->parser->parse((string) $text);

        if ($payload === null) {
            return null;
        }

        return [
            'payload' => $payload,
            'usage' => is_array($raw['usageMetadata'] ?? null) ? $raw['usageMetadata'] : [],
        ];
    }

    /**
     * @param  array<string, mixed>  $usage
     * @return array{input_tokens: int, output_tokens: int, total_tokens: int, prompt_token_count: int, candidates_token_count: int}
     */
    private function normalizeUsage(array $usage): array
    {
        $prompt = (int) ($usage['promptTokenCount'] ?? 0);
        $candidates = (int) ($usage['candidatesTokenCount'] ?? 0);

        return [
            'input_tokens' => $prompt,
            'output_tokens' => $candidates,
            'total_tokens' => (int) ($usage['totalTokenCount'] ?? ($prompt + $candidates)),
            'prompt_token_count' => $prompt,
            'candidates_token_count' => $candidates,
        ];
    }

    private function fallback(AdvisoryContextDTO $context, int $started, string $reason): AdvisoryResponseDTO
    {
        $content = $context->locale === 'gu'
            ? "આ સમયે AI સલાહ સેવા ઉપલબ્ધ નથી.\n\nવિષય: {$context->topic}\n\nકૃપા કરીને થોડી વાર પછી ફરી પ્રયાસ કરો."
            : "The AI advisory service is temporarily unavailable.\n\nTopic: {$context->topic}\n\nPlease try again in a few minutes.";

        return AdvisoryResponseDTO::placeholder(
            provider: $this->name(),
            model: $this->model(),
            content: $content,
            latencyMs: $this->latencyMs($started),
            raw: ['error' => $reason],
        );
    }

    private function latencyMs(int $started): int
    {
        return (int) ((hrtime(true) - $started) / 1_000_000);
    }
}
