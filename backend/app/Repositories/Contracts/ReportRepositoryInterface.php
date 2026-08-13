<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Report;
use Illuminate\Database\Eloquent\Collection;

interface ReportRepositoryInterface extends BaseRepositoryInterface
{
    public function reportsForUser(int $userId): Collection;

    /**
     * Report history for a user, newest first, optionally filtered by type.
     */
    public function reportsForUserByType(int $userId, ?string $reportType = null, int $limit = 50): Collection;

    /**
     * Favorite reports of a user, newest first.
     */
    public function favoritesForUser(int $userId): Collection;

    /**
     * Most recently generated reports of a user.
     */
    public function recentReports(int $userId, int $limit = 10): Collection;

    /**
     * A report owned by the user, or null when it does not exist / is not theirs.
     */
    public function findOwned(int $userId, int $reportId): ?Report;

    /**
     * Toggle the favorite flag of a report.
     */
    public function setFavorite(int $reportId, bool $favorite): ?Report;
}
