<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\DiseaseHistory;
use Illuminate\Database\Eloquent\Collection;

interface DiseaseHistoryRepositoryInterface extends BaseRepositoryInterface
{

    public function historyForField(int $fieldId): Collection;
}
