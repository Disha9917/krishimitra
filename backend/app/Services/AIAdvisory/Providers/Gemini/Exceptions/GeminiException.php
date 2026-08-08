<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory\Providers\Gemini\Exceptions;

use RuntimeException;

/**
 * Non-retryable failure talking to the Gemini API (auth, bad request, ...).
 */
class GeminiException extends RuntimeException
{
    public function __construct(string $message, public readonly ?int $statusCode = null, ?\Throwable $previous = null)
    {
        parent::__construct($message, $statusCode ?? 0, $previous);
    }
}
