<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\ContactRequest;
use App\Repositories\Contracts\ContactRequestRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentContactRequestRepository extends BaseEloquentRepository implements ContactRequestRepositoryInterface
{
    public function __construct(ContactRequest $model)
    {
        parent::__construct($model);
    }

    public function recent(int $limit = 20): Collection
    {
            return $this->model
                ->orderByDesc('id')
                ->limit($limit)
                ->get();
    }

    public function assignedTo(int $userId): Collection
    {
            return $this->model
                ->where('assigned_to', $userId)
                ->orderByDesc('id')
                ->get();
    }
}
