<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface SoilHistoryRepositoryInterface extends BaseRepositoryInterface
{
    public function historyForField(int $fieldId): Collection;

    /**
     * List a farmer's soil history, newest first, with optional filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function historyForFarmer(int $userId, array $filters = [], int $limit = 20): Collection;
}
