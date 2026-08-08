<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\SchemeApplication;
use App\Repositories\Contracts\SchemeApplicationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentSchemeApplicationRepository extends BaseEloquentRepository implements SchemeApplicationRepositoryInterface
{
    private const OPEN_STATUSES = ['submitted', 'under_review', 'approved'];

    public function __construct(SchemeApplication $model)
    {
        parent::__construct($model);
    }

    public function findForUser(int $applicationId, int $userId): ?SchemeApplication
    {
        return $this->model
            ->where('id', $applicationId)
            ->where('user_id', $userId)
            ->first();
    }

    public function applicationsForUser(int $userId, array $filters = [], int $limit = 20): Collection
    {
        $query = $this->model
            ->where('user_id', $userId);

        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('status', (string) $filters['status']);
        }

        return $query
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    public function applicationsForScheme(int $schemeId): Collection
    {
        return $this->model
            ->where('scheme_id', $schemeId)
            ->orderByDesc('submitted_at')
            ->get();
    }

    public function hasOpenApplication(int $userId, int $schemeId): bool
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('scheme_id', $schemeId)
            ->whereIn('status', self::OPEN_STATUSES)
            ->exists();
    }
}
