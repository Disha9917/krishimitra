<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory\Providers\Gemini;

use App\Services\AIAdvisory\Providers\Gemini\Exceptions\GeminiException;
use App\Services\AIAdvisory\Providers\Gemini\Exceptions\RetryableGeminiException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

/**
 * Thin HTTP wrapper around the Gemini generateContent endpoint. Owns the
 * request payload, headers, timeouts and error classification; all settings
 * (model, temperature, topP, topK, max output tokens, timeout) come from
 * config('ai.gemini'). Never hardcodes credentials.
 */
class GeminiClient
{
    private const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

    private const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent';

    /**
     * @param  array<string, mixed>  $config
     */
    public function __construct(private readonly array $config) {}

    public function model(): string
    {
        return (string) ($this->config['model'] ?? 'gemini-3.5-flash');
    }

    public function hasApiKey(): bool
    {
        return (string) ($this->config['api_key'] ?? '') !== '';
    }

    /**
     * @return array<string, mixed> decoded API response
     *
     * @throws RetryableGeminiException on 408/429/5xx or network failure
     * @throws GeminiException on any other API error
     */
    public function generate(string $prompt, string $systemInstruction): array
    {
        $payload = [
            'contents' => [
                ['role' => 'user', 'parts' => [['text' => $prompt]]],
            ],
            'systemInstruction' => [
                'parts' => [['text' => $systemInstruction]],
            ],
            'generationConfig' => [
                'temperature' => (float) ($this->config['temperature'] ?? 0.7),
                'topP' => (float) ($this->config['top_p'] ?? 0.95),
                'topK' => (int) ($this->config['top_k'] ?? 40),
                'maxOutputTokens' => (int) ($this->config['max_output_tokens'] ?? 2048),
                'responseMimeType' => 'application/json',
            ],
        ];

        $timeout = (int) ($this->config['timeout'] ?? 30);

        try {
            $response = Http::timeout($timeout)
                ->withHeaders([
                    'x-goog-api-key' => (string) $this->config['api_key'],
                    'Content-Type' => 'application/json',
                ])
                ->post(sprintf(self::ENDPOINT, $this->model()), $payload);
        } catch (ConnectionException $e) {
            throw new RetryableGeminiException('Gemini API network failure: '.$e->getMessage(), 0, $e);
        }

        return $this->decode($response);
    }

    /**
     * @return array<string, mixed>
     */
    private function decode(Response $response): array
    {
        $status = $response->status();

        if ($status === 200) {
            return $response->json() ?? [];
        }

        $message = $this->errorMessage($response);

        if (in_array($status, self::RETRYABLE_STATUS_CODES, true)) {
            throw new RetryableGeminiException("Gemini API error ({$status}): {$message}", $status);
        }

        throw new GeminiException("Gemini API error ({$status}): {$message}", $status);
    }

    private function errorMessage(Response $response): string
    {
        $body = $response->json();

        return is_array($body) && isset($body['error']['message'])
            ? (string) $body['error']['message']
            : $response->body();
    }
}
