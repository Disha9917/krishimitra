<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory\DTO;

/**
 * Normalized advisory request coming from the validated HTTP payload.
 */
final readonly class AdvisoryRequestDTO
{
    public function __construct(
        public string $topic,
        public string $advisoryType,
        public array $context,
        public string $locale,
    ) {}

    /**
     * @param  array<string, mixed>  $validated
     */
    public static function fromValidated(array $validated): self
    {
        return new self(
            topic: (string) ($validated['topic'] ?? ''),
            advisoryType: (string) ($validated['advisory_type'] ?? 'general'),
            context: (array) ($validated['context'] ?? []),
            locale: (string) ($validated['locale'] ?? 'en'),
        );
    }

    /**
     * @return array{topic: string, advisory_type: string, context: array<string, mixed>, locale: string}
     */
    public function toArray(): array
    {
        return [
            'topic' => $this->topic,
            'advisory_type' => $this->advisoryType,
            'context' => $this->context,
            'locale' => $this->locale,
        ];
    }
}
