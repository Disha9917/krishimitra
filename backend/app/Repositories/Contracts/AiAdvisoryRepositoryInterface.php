<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\AiAdvisory;
use Illuminate\Database\Eloquent\Collection;

interface AiAdvisoryRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * All advisories owned by the user, newest first.
     */
    public function advisoriesForUser(int $userId): Collection;

    /**
     * The user's advisory history, newest first, optionally filtered by
     * advisory type and capped by limit.
     */
    public function historyForUser(int $userId, ?string $advisoryType, int $limit): Collection;

    /**
     * Search the user's history with structured filters. Only advisories the
     * user owns are ever returned.
     *
     * Supported filters:
     * - advisory_type   string
     * - crop            string  (matches request/context JSON)
     * - field           string  (matches request/context JSON)
     * - district        string  (matches request/context JSON)
     * - risk_level      string  (Low|Medium|High)
     * - provider        string
     * - from            Y-m-d   (generated_at start)
     * - to              Y-m-d   (generated_at end)
     * - keyword         string  (topic/prompt/response)
     * - favorites       bool    (only favorited)
     * - limit           int (max 100)
     *
     * @param  array<string, mixed>  $filters
     */
    public function searchForUser(int $userId, array $filters): Collection;

    /**
     * A single advisory owned by the user, or null when it does not exist or
     * belongs to someone else.
     */
    public function findForUser(int $userId, int $id): ?AiAdvisory;

    /**
     * The user's favorited advisories, newest first.
     */
    public function favoritesForUser(int $userId, int $limit): Collection;

    public function setFavorite(AiAdvisory $advisory, bool $favorite): void;

    /**
     * Upsert the single feedback row for one advisory.
     *
     * @param  array{rating: int, helpful: bool, comment: string}  $feedback
     */
    public function saveFeedback(AiAdvisory $advisory, array $feedback): void;
}
