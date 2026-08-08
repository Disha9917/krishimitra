<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\DiseaseHistory;
use Illuminate\Database\Eloquent\Collection;

interface DiseaseHistoryRepositoryInterface extends BaseRepositoryInterface
{
    public function historyForField(int $fieldId): Collection;

    /**
     * List a farmer's history trail applying field/crop/date filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function historyForFarmer(int $userId, array $filters = [], int $limit = 20): Collection;

    /**
     * Find a history entry belonging to a specific farmer.
     */
    public function findForFarmer(int $userId, int $historyId): ?DiseaseHistory;
}
