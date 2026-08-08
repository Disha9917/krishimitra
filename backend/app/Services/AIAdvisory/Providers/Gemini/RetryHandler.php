<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory\Providers\Gemini;

use App\Services\AIAdvisory\Providers\Gemini\Exceptions\RetryableGeminiException;
use Throwable;

/**
 * Bounded retry loop with exponential backoff. Used by GeminiProvider to
 * survive transient API failures (429, 5xx, network) and empty or malformed
 * model responses: the operation returns null when the payload is unusable,
 * and RetryHandler treats that exactly like a retryable failure.
 */
class RetryHandler
{
    private int $attemptsUsed = 0;

    public function __construct(
        private readonly int $maxAttempts,
        private readonly int $baseDelayMs = 250,
        private readonly float $backoffMultiplier = 2.0,
    ) {}

    /**
     * Run the operation until it returns a non-null result, a non-retryable
     * failure occurs, or the attempt budget is exhausted.
     *
     * @template T
     *
     * @param  callable(): T|null  $operation
     * @return T|null
     */
    public function retry(callable $operation): mixed
    {
        $lastError = null;
        $this->attemptsUsed = 0;

        for ($attempt = 1; $attempt <= $this->maxAttempts; $attempt++) {
            $this->attemptsUsed = $attempt;

            try {
                $result = $operation();

                if ($result !== null) {
                    return $result;
                }

                $lastError = null;
            } catch (RetryableGeminiException $e) {
                $lastError = $e;
            } catch (Throwable $e) {
                throw $e;
            }

            if ($attempt < $this->maxAttempts) {
                usleep($this->delayMs($attempt) * 1000);
            }
        }

        if ($lastError !== null) {
            throw $lastError;
        }

        return null;
    }

    /**
     * Attempts consumed by the most recent retry() run.
     */
    public function attemptsUsed(): int
    {
        return $this->attemptsUsed;
    }

    public function maxAttempts(): int
    {
        return $this->maxAttempts;
    }

    private function delayMs(int $attempt): int
    {
        return (int) round($this->baseDelayMs * ($this->backoffMultiplier ** ($attempt - 1)));
    }
}
