<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\FarmerCrop;
use Illuminate\Database\Eloquent\Collection;

interface FarmerCropRepositoryInterface extends BaseRepositoryInterface
{
    public function cropsForUser(int $userId): Collection;

    public function cropsForField(int $fieldId): Collection;

    /**
     * Fetch one crop that belongs to a user, or null when missing or not owned.
     */
    public function findForUser(int $userId, int $cropId): ?FarmerCrop;

    /**
     * List the farmer's currently active (is_current) crops.
     */
    public function activeCropsForUser(int $userId): Collection;

    /**
     * List the farmer's crops planted in a given season.
     */
    public function seasonalCropsForUser(int $userId, string $season): Collection;

    /**
     * Full crop history for a farmer, including soft-deleted crops and harvests.
     */
    public function cropHistoryForUser(int $userId): Collection;

    /**
     * The currently active crop in a field, or null when none is active.
     */
    public function activeCropForField(int $fieldId): ?FarmerCrop;
}
