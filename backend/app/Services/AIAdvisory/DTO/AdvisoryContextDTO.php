<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory\DTO;

/**
 * Structured, provider-agnostic context for one advisory request. Future
 * phases enrich the sections with profile, farm, weather, soil and market
 * data. This DTO is the single source the prompt builder and providers read.
 */
final readonly class AdvisoryContextDTO
{
    /**
     * @param  array<string, array<string, mixed>>  $sections  ordered context sections
     */
    public function __construct(
        public string $topic,
        public string $advisoryType,
        public string $locale,
        public array $sections,
    ) {}

    public static function fromRequest(AdvisoryRequestDTO $request): self
    {
        $sections = [];

        foreach ($request->context as $key => $value) {
            $sections[(string) $key] = is_array($value) ? $value : ['value' => $value];
        }

        return new self(
            topic: $request->topic,
            advisoryType: $request->advisoryType,
            locale: $request->locale,
            sections: $sections,
        );
    }

    /**
     * Normalized payload used by the prompt builder.
     *
     * @return array{topic: string, advisory_type: string, locale: string, sections: array<string, array<string, mixed>>}
     */
    public function toPromptData(): array
    {
        return [
            'topic' => $this->topic,
            'advisory_type' => $this->advisoryType,
            'locale' => $this->locale,
            'sections' => $this->sections,
        ];
    }
}
