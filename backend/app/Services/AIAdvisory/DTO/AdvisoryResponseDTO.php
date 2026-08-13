<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory\DTO;

use Carbon\CarbonImmutable;

/**
 * Normalized provider output. Every provider (real or placeholder) must
 * return this shape so controllers and resources never change.
 */
final readonly class AdvisoryResponseDTO
{
    /**
     * @param  array<string, mixed>  $usage
     * @param  array<string, mixed>  $raw
     */
    public function __construct(
        public string $content,
        public string $provider,
        public string $model,
        public array $usage,
        public int $latencyMs,
        public CarbonImmutable $createdAt,
        public array $raw,
    ) {}

    /**
     * Builds a response without touching any external AI service.
     *
     * @param  array<string, mixed>  $raw
     */
    public static function placeholder(string $provider, string $model, string $content, int $latencyMs = 0, array $raw = []): self
    {
        return new self(
            content: $content,
            provider: $provider,
            model: $model,
            usage: ['input_tokens' => 0, 'output_tokens' => 0, 'total_tokens' => 0],
            latencyMs: $latencyMs,
            createdAt: CarbonImmutable::now(),
            raw: $raw,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'content' => $this->content,
            'provider' => $this->provider,
            'model' => $this->model,
            'usage' => $this->usage,
            'latency_ms' => $this->latencyMs,
            'created_at' => $this->createdAt->toIso8601String(),
        ];
    }
}
