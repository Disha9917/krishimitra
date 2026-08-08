<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory;

use App\Repositories\Contracts\AiAdvisoryRepositoryInterface;
use App\Services\AIAdvisory\Contracts\AdvisoryContextBuilderInterface;
use App\Services\AIAdvisory\Contracts\AIAdvisoryServiceInterface;
use App\Services\AIAdvisory\Contracts\AIProviderInterface;
use App\Services\AIAdvisory\Contracts\PromptBuilderInterface;
use App\Services\AIAdvisory\DTO\AdvisoryRequestDTO;
use App\Services\AIAdvisory\DTO\AdvisoryResponseDTO;
use Illuminate\Database\Eloquent\Collection;

/**
 * Owns the AI advisory pipeline: request -> context -> prompt -> provider ->
 * persist -> response. No AI logic lives in the controller and the active
 * provider is swappable through the container.
 */
class AIAdvisoryService implements AIAdvisoryServiceInterface
{
    public function __construct(
        private readonly AIProviderInterface $provider,
        private readonly PromptBuilderInterface $promptBuilder,
        private readonly AdvisoryContextBuilderInterface $contextBuilder,
        private readonly AiAdvisoryRepositoryInterface $advisories,
    ) {}

    public function requestAdvisory(int $userId, AdvisoryRequestDTO $request): AdvisoryResponseDTO
    {
        $context = $this->contextBuilder->build($userId, $request);
        $prompt = $this->promptBuilder->build($context);

        $started = hrtime(true);
        $response = $this->provider->generate($prompt, $context);
        $latencyMs = (int) ((hrtime(true) - $started) / 1_000_000);

        $this->advisories->create([
            'user_id' => $userId,
            'advisory_type' => $request->advisoryType,
            'input_snapshot' => $request->toArray(),
            'top3_advisories' => [],
            'irrigation_plan' => [],
            'fertilizer_plan' => [],
            'pest_alert' => [],
            'timeline_7_days' => [],
            'provider' => $response->provider,
            'model_version' => $response->model,
            'prompt_text' => $prompt,
            'response_content' => $response->content,
            'usage' => $response->usage,
            'latency_ms' => $latencyMs,
            'generated_at' => now(),
        ]);

        return $response;
    }

    public function history(int $userId, ?string $advisoryType = null, int $limit = 20): Collection
    {
        return $this->advisories->historyForUser($userId, $advisoryType, $limit);
    }

    public function providers(): array
    {
        $active = $this->activeProvider();

        return array_map(
            function (string $key, string $class) use ($active): array {
                $instance = app($class);

                return [
                    'key' => $key,
                    'label' => $instance->label(),
                    'model' => $instance->model(),
                    'active' => $key === $active,
                ];
            },
            array_keys(config('ai.providers')),
            array_values(config('ai.providers')),
        );
    }

    public function activeProvider(): string
    {
        return (string) config('ai.provider');
    }
}
