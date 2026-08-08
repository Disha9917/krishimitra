<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

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
}
