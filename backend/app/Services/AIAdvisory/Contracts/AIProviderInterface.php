<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory\Contracts;

use App\Services\AIAdvisory\DTO\AdvisoryContextDTO;
use App\Services\AIAdvisory\DTO\AdvisoryResponseDTO;

/**
 * Contract every AI vendor provider must implement. Swap the binding of
 * this interface to route advisory requests to a different vendor.
 */
interface AIProviderInterface
{
    /**
     * Stable provider key (e.g. "gemini", "openai", "null").
     */
    public function name(): string;

    /**
     * Human readable provider label.
     */
    public function label(): string;

    /**
     * Model identifier used by this provider.
     */
    public function model(): string;

    /**
     * Generate a normalized advisory response for the assembled prompt and
     * its structured context. Must never throw provider-specific exceptions.
     */
    public function generate(string $prompt, AdvisoryContextDTO $context): AdvisoryResponseDTO;
}
