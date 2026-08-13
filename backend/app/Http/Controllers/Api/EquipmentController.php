<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ListEquipmentRequest;
use App\Http\Requests\StoreEquipmentRequest;
use App\Http\Requests\UpdateEquipmentRequest;
use App\Http\Resources\EquipmentDashboardResource;
use App\Http\Resources\EquipmentResource;
use App\Services\Equipment\EquipmentServiceInterface;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    public function __construct(
        private readonly EquipmentServiceInterface $equipment,
    ) {}

    public function index(ListEquipmentRequest $request): JsonResponse
    {
        return ApiResponse::success(
            EquipmentResource::collection(
                $this->equipment->listEquipment(
                    $this->filters($request->validated()),
                    $this->limit($request),
                ),
            ),
        );
    }

    public function store(StoreEquipmentRequest $request): JsonResponse
    {
        $listing = $this->equipment->createListing(
            (int) $request->user()->id,
            $this->attributes($request->validated()),
        );

        return ApiResponse::success(
            new EquipmentResource($listing),
            'Equipment listing created.',
            201,
        );
    }

    public function show(Request $request, int $equipmentId): JsonResponse
    {
        $listing = $this->equipment->findEquipment($equipmentId);

        if ($listing === null) {
            return ApiResponse::error('Equipment not found.', 404, 'equipment_not_found');
        }

        return ApiResponse::success(new EquipmentResource($listing));
    }

    public function update(UpdateEquipmentRequest $request, int $equipmentId): JsonResponse
    {
        $listing = $this->equipment->updateListing(
            (int) $request->user()->id,
            $equipmentId,
            $this->attributes($request->validated()),
        );

        return ApiResponse::success(
            new EquipmentResource($listing),
            'Equipment listing updated.',
        );
    }

    public function destroy(Request $request, int $equipmentId): JsonResponse
    {
        $this->equipment->deleteListing((int) $request->user()->id, $equipmentId);

        return ApiResponse::success(null, 'Equipment listing deleted.');
    }

    public function mine(Request $request): JsonResponse
    {
        return ApiResponse::success(
            EquipmentResource::collection(
                $this->equipment->myListings((int) $request->user()->id),
            ),
        );
    }

    public function dashboard(Request $request): JsonResponse
    {
        return ApiResponse::success(
            new EquipmentDashboardResource(
                $this->equipment->dashboard((int) $request->user()->id),
            ),
        );
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function attributes(array $validated): array
    {
        $map = [
            'name' => 'name',
            'equipmentType' => 'equipment_type',
            'category' => 'category',
            'brand' => 'brand',
            'model' => 'model',
            'description' => 'description',
            'dailyRate' => 'daily_rate',
            'hourlyRate' => 'hourly_rate',
            'depositAmount' => 'deposit_amount',
            'pincode' => 'pincode',
            'districtId' => 'district_id',
            'talukaId' => 'taluka_id',
            'villageId' => 'village_id',
            'lat' => 'lat',
            'lng' => 'lng',
            'isAvailable' => 'is_available',
            'imageFileId' => 'image_file_id',
            'imageFileIds' => 'image_file_ids',
        ];

        return $this->remap($validated, $map);
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function filters(array $validated): array
    {
        $map = [
            'equipmentType' => 'type',
            'category' => 'category',
            'districtId' => 'district_id',
            'talukaId' => 'taluka_id',
            'villageId' => 'village_id',
            'availability' => 'availability',
            'minPrice' => 'min_price',
            'maxPrice' => 'max_price',
            'minRating' => 'min_rating',
            'ownerId' => 'owner_id',
            'search' => 'search',
        ];

        return $this->remap($validated, $map);
    }

    /**
     * @param  array<string, mixed>  $validated
     * @param  array<string, string>  $map
     * @return array<string, mixed>
     */
    private function remap(array $validated, array $map): array
    {
        $out = [];

        foreach ($map as $requestKey => $attribute) {
            if (array_key_exists($requestKey, $validated) && $validated[$requestKey] !== null) {
                $out[$attribute] = $validated[$requestKey];
            }
        }

        return $out;
    }

    private function limit(Request $request): int
    {
        return $request->validated('limit') !== null
            ? (int) $request->validated('limit')
            : 20;
    }
}
