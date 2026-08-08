<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory;

use App\Models\AiAdvisory;
use App\Repositories\Contracts\AiAdvisoryRepositoryInterface;
use App\Services\AIAdvisory\Contracts\AIHistoryServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Owns all AI advisory history management: listing with search filters,
 * single-advisory access, soft delete, favorites and one-feedback-per
 * advisory. Every method enforces user ownership at the repository level -
 * a user can only ever reach their own records.
 */
class AIHistoryService implements AIHistoryServiceInterface
{
    public function __construct(
        private readonly AiAdvisoryRepositoryInterface $advisories,
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     */
    public function history(int $userId, array $filters): Collection
    {
        return $this->advisories->searchForUser($userId, $filters);
    }

    /**
     * @throws ModelNotFoundException when the advisory does not exist or
     *                                belongs to another user
     */
    public function show(int $userId, int $id): AiAdvisory
    {
        return $this->owned($userId, $id);
    }

    public function destroy(int $userId, int $id): void
    {
        $advisory = $this->owned($userId, $id);
        $advisory->delete();
    }

    public function favorite(int $userId, int $id): AiAdvisory
    {
        $advisory = $this->owned($userId, $id);
        $this->advisories->setFavorite($advisory, true);

        return $advisory;
    }

    public function unfavorite(int $userId, int $id): AiAdvisory
    {
        $advisory = $this->owned($userId, $id);
        $this->advisories->setFavorite($advisory, false);

        return $advisory;
    }

    public function favorites(int $userId, int $limit): Collection
    {
        return $this->advisories->favoritesForUser($userId, max(1, min(100, $limit)));
    }

    /**
     * Upsert feedback. One feedback per advisory is guaranteed by the single
     * feedback columns on the row - submitting again simply updates it.
     *
     * @param  array{rating: int, helpful: bool, comment: string}  $feedback
     */
    public function feedback(int $userId, int $id, array $feedback): AiAdvisory
    {
        $advisory = $this->owned($userId, $id);
        $this->advisories->saveFeedback($advisory, $feedback);

        return $advisory;
    }

    /**
     * @throws ModelNotFoundException
     */
    private function owned(int $userId, int $id): AiAdvisory
    {
        $advisory = $this->advisories->findForUser($userId, $id);

        if ($advisory === null) {
            throw new ModelNotFoundException('Advisory not found or not owned by this user.');
        }

        return $advisory;
    }
}
