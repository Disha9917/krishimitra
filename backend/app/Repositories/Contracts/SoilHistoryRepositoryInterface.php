<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\SoilHistory;
use Illuminate\Database\Eloquent\Collection;

interface SoilHistoryRepositoryInterface extends BaseRepositoryInterface
{

    public function historyForField(int $fieldId): Collection;
}
