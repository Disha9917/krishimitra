<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\GovernmentScheme;
use Illuminate\Database\Eloquent\Collection;

interface GovernmentSchemeRepositoryInterface extends BaseRepositoryInterface
{
    public function activeSchemes(): Collection;

    public function schemesByCategory(string $category): Collection;

    /**
     * Find a scheme that is currently active, or null.
     */
    public function findActive(int $schemeId): ?GovernmentScheme;

    /**
     * List active schemes applying optional filters:
     * category, state, district_id (json contains), crop_id (json contains),
     * search (title/code/description), limit.
     *
     * @param  array<string, mixed>  $filters
     */
    public function listSchemes(array $filters = [], int $limit = 20): Collection;

    /**
     * Active schemes whose deadline falls within the next $days days.
     */
    public function expiringSoon(int $days = 30): Collection;
}
