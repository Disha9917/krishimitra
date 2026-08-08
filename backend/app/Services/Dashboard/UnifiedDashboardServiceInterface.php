<?php

declare(strict_types=1);

namespace App\Services\Dashboard;

interface UnifiedDashboardServiceInterface
{
    /**
     * Build (or serve from cache) the unified dashboard payload for a farmer.
     *
     * @return array<string, mixed>
     */
    public function unifiedDashboard(int $userId): array;

    /**
     * Drop the cached payload and rebuild it immediately.
     *
     * @return array<string, mixed>
     */
    public function refreshUnifiedDashboard(int $userId): array;

    /**
     * The cache key holding a user's unified dashboard payload.
     */
    public function cacheKey(int $userId): string;
}
