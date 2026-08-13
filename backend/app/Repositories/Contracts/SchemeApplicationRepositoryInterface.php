<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\SchemeApplication;
use Illuminate\Database\Eloquent\Collection;

interface SchemeApplicationRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Find an application belonging to a specific user, or null.
     */
    public function findForUser(int $applicationId, int $userId): ?SchemeApplication;

    /**
     * Applications for a user, optionally filtered by status.
     *
     * @param  array<string, mixed>  $filters
     */
    public function applicationsForUser(int $userId, array $filters = [], int $limit = 20): Collection;

    public function applicationsForScheme(int $schemeId): Collection;

    /**
     * Whether the user has an open (submitted / under review / approved)
     * application for the given scheme.
     */
    public function hasOpenApplication(int $userId, int $schemeId): bool;
}
