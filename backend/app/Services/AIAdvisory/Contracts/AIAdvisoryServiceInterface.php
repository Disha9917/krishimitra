<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory\Contracts;

use App\Models\AiAdvisory;
use App\Services\AIAdvisory\DTO\AdvisoryRequestDTO;
use App\Services\AIAdvisory\DTO\AdvisoryResponseDTO;
use Illuminate\Database\Eloquent\Collection;

/**
 * Orchestrates the AI advisory pipeline without knowing which vendor is
 * behind it. Providers are swappable via the container — controllers never
 * change when a new provider is introduced.
 */
interface AIAdvisoryServiceInterface
{
    /**
     * Build structured context, assemble the prompt, delegate to the active
     * provider and persist the advisory trail. Returns the provider response.
     */
    public function requestAdvisory(int $userId, AdvisoryRequestDTO $request): AdvisoryResponseDTO;

    /**
     * The user's advisory history (own records only).
     *
     * @return Collection<int, AiAdvisory>
     */
    public function history(int $userId, ?string $advisoryType = null, int $limit = 20): Collection;

    /**
     * Registered provider descriptors (key, label, model, active flag).
     *
     * @return list<array{key: string, label: string, model: string, active: bool}>
     */
    public function providers(): array;

    /**
     * The key of the currently active provider.
     */
    public function activeProvider(): string;
}
