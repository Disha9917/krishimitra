<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory\Contracts;

use App\Services\AIAdvisory\DTO\AdvisoryContextDTO;

/**
 * Assembles a structured prompt from an advisory context. This class only
 * formats data — it must never call an AI provider or external service.
 */
interface PromptBuilderInterface
{
    /**
     * Turn a structured context into a prompt string.
     */
    public function build(AdvisoryContextDTO $context): string;
}
