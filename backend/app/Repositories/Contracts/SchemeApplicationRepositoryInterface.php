<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\SchemeApplication;
use Illuminate\Database\Eloquent\Collection;

interface SchemeApplicationRepositoryInterface extends BaseRepositoryInterface
{

    public function applicationsForUser(int $userId): Collection;

    public function applicationsForScheme(int $schemeId): Collection;
}
