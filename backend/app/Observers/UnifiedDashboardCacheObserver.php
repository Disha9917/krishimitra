<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ColdStorage;
use App\Models\Equipment;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Invalidates the unified dashboard cache whenever any module record that
 * feeds the dashboard is created, updated, deleted or restored.
 *
 * Owner resolution: the model's own user_id/owner_id/provider_id columns are
 * used first; booking models additionally invalidate the cache of the owner
 * of the related equipment / cold storage / vehicle.
 */
class UnifiedDashboardCacheObserver
{
    public function created(Model $model): void
    {
        $this->invalidate($model);
    }

    public function updated(Model $model): void
    {
        $this->invalidate($model);
    }

    public function deleted(Model $model): void
    {
        $this->invalidate($model);
    }

    public function restored(Model $model): void
    {
        $this->invalidate($model);
    }

    private function invalidate(Model $model): void
    {
        foreach ($this->userIdsFor($model) as $userId) {
            Cache::forget((string) config('dashboard.prefix').$userId);
        }
    }

    /**
     * @return array<int, int>
     */
    private function userIdsFor(Model $model): array
    {
        $ids = [];

        foreach (['user_id', 'owner_id', 'provider_id'] as $attribute) {
            $value = $model->getAttribute($attribute);

            if ($value !== null) {
                $ids[] = (int) $value;
            }
        }

        $ownerLookups = [
            'equipment_id' => ['class' => Equipment::class, 'owner' => 'provider_id'],
            'vehicle_id' => ['class' => Vehicle::class, 'owner' => 'owner_id'],
            'cold_storage_id' => ['class' => ColdStorage::class, 'owner' => 'owner_id'],
        ];

        foreach ($ownerLookups as $attribute => $lookup) {
            $value = $model->getAttribute($attribute);

            if ($value === null) {
                continue;
            }

            $owner = $lookup['class']::query()->whereKey($value)->value($lookup['owner']);

            if ($owner !== null) {
                $ids[] = (int) $owner;
            }
        }

        return array_values(array_unique(array_filter($ids)));
    }
}
