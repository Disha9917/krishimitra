<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\ContactRequest;
use Illuminate\Database\Eloquent\Collection;

interface ContactRequestRepositoryInterface extends BaseRepositoryInterface
{

    public function recent(int $limit = 20): Collection;

    public function assignedTo(int $userId): Collection;
}
