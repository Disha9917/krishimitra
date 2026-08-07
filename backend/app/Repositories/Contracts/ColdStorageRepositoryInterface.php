<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\ColdStorage;
use Illuminate\Database\Eloquent\Collection;

interface ColdStorageRepositoryInterface extends BaseRepositoryInterface
{

    public function availableStorage(): Collection;
}
