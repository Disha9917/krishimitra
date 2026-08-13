<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Report;
use App\Repositories\Contracts\ReportRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentReportRepository extends BaseEloquentRepository implements ReportRepositoryInterface
{
    public function __construct(Report $model)
    {
        parent::__construct($model);
    }

    public function reportsForUser(int $userId): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->orderByDesc('generated_at')->orderByDesc('id')
            ->get();
    }

    public function reportsForUserByType(int $userId, ?string $reportType = null, int $limit = 50): Collection
    {
        $query = $this->model->where('user_id', $userId);

        if ($reportType !== null) {
            $query->where('report_type', $reportType);
        }

        return $query
            ->orderByDesc('generated_at')->orderByDesc('id')
            ->limit($limit)
            ->get();
    }

    public function favoritesForUser(int $userId): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('is_favorite', true)
            ->orderByDesc('generated_at')->orderByDesc('id')
            ->get();
    }

    public function recentReports(int $userId, int $limit = 10): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->orderByDesc('generated_at')->orderByDesc('id')
            ->limit($limit)
            ->get();
    }

    public function findOwned(int $userId, int $reportId): ?Report
    {
        /** @var Report|null */
        return $this->model
            ->where('user_id', $userId)
            ->whereKey($reportId)
            ->first();
    }

    public function setFavorite(int $reportId, bool $favorite): ?Report
    {
        return $this->update($reportId, ['is_favorite' => $favorite]);
    }
}
