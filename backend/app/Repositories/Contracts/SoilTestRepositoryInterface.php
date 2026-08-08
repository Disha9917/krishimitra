<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\SoilTest;
use Illuminate\Database\Eloquent\Collection;

interface SoilTestRepositoryInterface extends BaseRepositoryInterface
{
    public function latestForFarmer(int $userId, int $limit = 5): Collection;

    /**
     * List a farmer's soil tests, newest first, with optional filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function listForFarmer(int $userId, array $filters = [], int $limit = 20): Collection;

    /**
     * Find a soil test owned by the given farmer.
     */
    public function findForFarmer(int $userId, int $testId): ?SoilTest;
}
