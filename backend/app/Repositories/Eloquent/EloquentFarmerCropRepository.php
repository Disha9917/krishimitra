<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\FarmerCrop;
use App\Repositories\Contracts\FarmerCropRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentFarmerCropRepository extends BaseEloquentRepository implements FarmerCropRepositoryInterface
{
    public function __construct(FarmerCrop $model)
    {
        parent::__construct($model);
    }

    public function cropsForUser(int $userId): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->with(['crop', 'field'])
            ->orderByDesc('id')
            ->get();
    }

    public function cropsForField(int $fieldId): Collection
    {
        return $this->model
            ->where('field_id', $fieldId)
            ->orderByDesc('id')
            ->get();
    }

    public function findForUser(int $userId, int $cropId): ?FarmerCrop
    {
        return $this->model
            ->where('user_id', $userId)
            ->with(['crop', 'field', 'harvests'])
            ->find($cropId);
    }

    public function activeCropsForUser(int $userId): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('is_current', true)
            ->with(['crop', 'field'])
            ->orderByDesc('sowing_date')
            ->get();
    }

    public function seasonalCropsForUser(int $userId, string $season): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('season', $season)
            ->with(['crop', 'field'])
            ->orderByDesc('id')
            ->get();
    }

    public function cropHistoryForUser(int $userId): Collection
    {
        return $this->model
            ->withTrashed()
            ->where('user_id', $userId)
            ->with(['crop', 'field', 'harvests'])
            ->orderByDesc('id')
            ->get();
    }

    public function activeCropForField(int $fieldId): ?FarmerCrop
    {
        return $this->model
            ->where('field_id', $fieldId)
            ->where('is_current', true)
            ->first();
    }
}
