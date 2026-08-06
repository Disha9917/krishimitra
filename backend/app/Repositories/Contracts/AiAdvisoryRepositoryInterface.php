<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\AiAdvisory;
use Illuminate\Database\Eloquent\Collection;

interface AiAdvisoryRepositoryInterface extends BaseRepositoryInterface
{

    public function advisoriesForUser(int $userId): Collection;
}
