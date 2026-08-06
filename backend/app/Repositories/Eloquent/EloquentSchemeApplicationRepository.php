<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\SchemeApplication;
use App\Repositories\Contracts\SchemeApplicationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentSchemeApplicationRepository extends BaseEloquentRepository implements SchemeApplicationRepositoryInterface
{
    public function __construct(SchemeApplication $model)
    {
        parent::__construct($model);
    }

    public function applicationsForUser(int $userId): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->orderByDesc('submitted_at')
                ->get();
    }

    public function applicationsForScheme(int $schemeId): Collection
    {
            return $this->model
                ->where('scheme_id', $schemeId)
                ->orderByDesc('submitted_at')
                ->get();
    }
}
