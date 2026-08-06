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
}
