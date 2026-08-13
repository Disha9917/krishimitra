<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory\Providers\Gemini\Exceptions;

/**
 * Transient failure worth retrying: rate limiting (429), server errors
 * (5xx) or network connectivity problems.
 */
class RetryableGeminiException extends GeminiException {}
