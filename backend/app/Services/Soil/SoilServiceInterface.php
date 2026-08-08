<?php

declare(strict_types=1);

namespace App\Services\Soil;

use App\Models\SoilHistory;
use App\Models\SoilTest;
use Illuminate\Database\Eloquent\Collection;

interface SoilServiceInterface
{
    /**
     * Record a lab test and snapshot it into the soil history trail.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws \DomainException when the field does not belong to the user
     */
    public function recordSoilTest(int $userId, int $fieldId, array $data): SoilTest;

    public function latestTests(int $userId, int $limit = 5): Collection;

    public function historyForField(int $fieldId): Collection;

    /**
     * Classify the latest soil snapshot into readable health indicators.
     *
     * @return array<string, mixed>
     */
    public function soilHealthSummary(int $fieldId): array;

    /**
     * Apply the latest observed history to a field record.
     */
    public function applyLatestHistory(int $fieldId): ?SoilHistory;

    /**
     * Create a soil test for the farmer's field; health score, status and
     * fertility level are calculated automatically and a new history record
     * is appended.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws \DomainException when the field does not belong to the user
     */
    public function createSoilTest(int $userId, int $fieldId, array $data): SoilTest;

    /**
     * Update an existing soil test; a new history snapshot is appended so the
     * historical trail is never overwritten.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateSoilTest(int $userId, int $testId, array $data): ?SoilTest;

    public function deleteSoilTest(int $userId, int $testId): bool;

    public function getSoilTest(int $userId, int $testId): ?SoilTest;

    /**
     * @param  array<string, mixed>  $filters
     */
    public function listSoilTests(int $userId, array $filters = [], int $limit = 20): Collection;

    /**
     * @param  array<string, mixed>  $filters
     */
    public function soilHistory(int $userId, array $filters = [], int $limit = 20): Collection;

    /**
     * Full health assessment for a field (score, status, fertility, nutrient
     * summary and alerts) based on the latest soil test.
     *
     * @return array<string, mixed>
     *
     * @throws \DomainException when the field does not belong to the user
     */
    public function soilHealth(int $userId, int $fieldId): array;

    /**
     * Farmer-wide soil dashboard: latest report, average health, nutrient
     * chart series and aggregated alerts.
     *
     * @return array<string, mixed>
     */
    public function soilDashboard(int $userId): array;

    /**
     * Rule-based recommendations (fertilizer, lime, organic matter,
     * irrigation) for a soil test.
     *
     * @return array<string, mixed>|null
     */
    public function soilRecommendations(int $userId, int $testId): ?array;
}
