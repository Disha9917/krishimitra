<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CropCalendarRequest;
use App\Http\Requests\SeasonalCropsRequest;
use App\Http\Requests\StoreCropRequest;
use App\Http\Requests\UpdateCropRequest;
use App\Http\Resources\CropCalendarResource;
use App\Http\Resources\CropDetailResource;
use App\Http\Resources\CropGrowthResource;
use App\Http\Resources\CropStatusResource;
use App\Http\Resources\CropSummaryResource;
use App\Http\Resources\CropTimelineResource;
use App\Http\Resources\FarmerCropResource;
use App\Http\Resources\HarvestSummaryResource;
use App\Services\Crop\CropServiceInterface;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CropController extends Controller
{
    public function __construct(
        private readonly CropServiceInterface $crops,
    ) {}

    public function index(Request $request): JsonResponse
    {
        return ApiResponse::success(
            FarmerCropResource::collection($this->crops->cropsForUser((int) $request->user()->id)),
        );
    }

    public function store(StoreCropRequest $request): JsonResponse
    {
        $crop = $this->crops->recordCrop(
            (int) $request->user()->id,
            $this->cropAttributes($request->validated()),
            (bool) $request->validated('allowOverlap', false),
        );

        return ApiResponse::success(new FarmerCropResource($crop), 'Crop recorded successfully.', 201);
    }

    public function show(Request $request, int $cropId): JsonResponse
    {
        $crop = $this->crops->getFarmerCrop((int) $request->user()->id, $cropId);

        if ($crop === null) {
            return ApiResponse::error('Crop not found.', 404, 'crop_not_found');
        }

        return ApiResponse::success(new CropDetailResource(
            $crop,
            $this->crops->farmerCropGrowthStage((int) $request->user()->id, $cropId),
            $this->crops->farmerCropStatus((int) $request->user()->id, $cropId),
        ));
    }

    public function update(UpdateCropRequest $request, int $cropId): JsonResponse
    {
        $crop = $this->crops->updateFarmerCrop(
            (int) $request->user()->id,
            $cropId,
            $this->cropAttributes($request->validated()),
        );

        if ($crop === null) {
            return ApiResponse::error('Crop could not be updated.', 422, 'crop_update_failed');
        }

        return ApiResponse::success(new FarmerCropResource($crop), 'Crop updated successfully.');
    }

    public function destroy(Request $request, int $cropId): JsonResponse
    {
        $deleted = $this->crops->deleteFarmerCrop((int) $request->user()->id, $cropId);

        if (! $deleted) {
            return ApiResponse::error('Crop could not be deleted.', 422, 'crop_delete_failed');
        }

        return ApiResponse::success(null, 'Crop deleted successfully.');
    }

    public function active(Request $request): JsonResponse
    {
        return ApiResponse::success(
            FarmerCropResource::collection($this->crops->activeCropsForUser((int) $request->user()->id)),
        );
    }

    public function seasonal(SeasonalCropsRequest $request): JsonResponse
    {
        return ApiResponse::success(
            FarmerCropResource::collection(
                $this->crops->seasonalCropsForUser((int) $request->user()->id, (string) $request->validated('season')),
            ),
        );
    }

    public function history(Request $request): JsonResponse
    {
        return ApiResponse::success(
            FarmerCropResource::collection($this->crops->cropHistoryForUser((int) $request->user()->id)),
        );
    }

    public function timeline(Request $request, int $cropId): JsonResponse
    {
        $timeline = $this->crops->farmerCropTimeline((int) $request->user()->id, $cropId);

        if ($timeline === null) {
            return ApiResponse::error('Crop not found.', 404, 'crop_not_found');
        }

        return ApiResponse::success(new CropTimelineResource($timeline));
    }

    public function calendar(CropCalendarRequest $request): JsonResponse
    {
        $calendar = $this->crops->farmerCropCalendar(
            (int) $request->user()->id,
            $request->validated('year') !== null ? (int) $request->validated('year') : null,
        );

        return ApiResponse::success(new CropCalendarResource($calendar));
    }

    public function growth(Request $request, int $cropId): JsonResponse
    {
        $growth = $this->crops->farmerCropGrowthStage((int) $request->user()->id, $cropId);

        if ($growth === null) {
            return ApiResponse::error('Crop not found.', 404, 'crop_not_found');
        }

        return ApiResponse::success(new CropGrowthResource($growth));
    }

    public function status(Request $request, int $cropId): JsonResponse
    {
        $status = $this->crops->farmerCropStatus((int) $request->user()->id, $cropId);

        if ($status === null) {
            return ApiResponse::error('Crop not found.', 404, 'crop_not_found');
        }

        return ApiResponse::success(new CropStatusResource($status));
    }

    public function harvestSummary(Request $request): JsonResponse
    {
        return ApiResponse::success(
            HarvestSummaryResource::collection($this->crops->harvestSummary((int) $request->user()->id)),
        );
    }

    public function summary(Request $request): JsonResponse
    {
        return ApiResponse::success(
            new CropSummaryResource($this->crops->dashboardCropSummary((int) $request->user()->id)),
        );
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function cropAttributes(array $validated): array
    {
        $map = [
            'cropId' => 'crop_id',
            'fieldId' => 'field_id',
            'season' => 'season',
            'sowingDate' => 'sowing_date',
            'expectedHarvestDate' => 'expected_harvest_date',
            'isCurrent' => 'is_current',
            'allowOverlap' => 'allow_overlap',
        ];

        $attributes = [];

        foreach ($map as $requestKey => $modelKey) {
            if (array_key_exists($requestKey, $validated)) {
                $attributes[$modelKey] = $validated[$requestKey];
            }
        }

        return $attributes;
    }
}
