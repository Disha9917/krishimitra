<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ListColdStoragesRequest;
use App\Http\Requests\StoreColdStorageRequest;
use App\Http\Requests\UpdateColdStorageRequest;
use App\Http\Resources\ColdStorageDashboardResource;
use App\Http\Resources\ColdStorageResource;
use App\Http\Resources\StorageMonitoringResource;
use App\Services\ColdStorage\ColdStorageServiceInterface;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ColdStorageController extends Controller
{
    public function __construct(
        private readonly ColdStorageServiceInterface $storage,
    ) {}

    public function index(ListColdStoragesRequest $request): JsonResponse
    {
        return ApiResponse::success(
            ColdStorageResource::collection(
                $this->storage->listStorages(
                    $this->filters($request->validated()),
                    $this->limit($request),
                ),
            ),
        );
    }

    public function store(StoreColdStorageRequest $request): JsonResponse
    {
        $facility = $this->storage->createStorage(
            (int) $request->user()->id,
            $this->attributes($request->validated()),
        );

        return ApiResponse::success(
            new ColdStorageResource($facility),
            'Cold storage facility created.',
            201,
        );
    }

    public function show(Request $request, int $storageId): JsonResponse
    {
        $facility = $this->storage->findStorage($storageId);

        if ($facility === null) {
            return ApiResponse::error('Cold storage not found.', 404, 'cold_storage_not_found');
        }

        return ApiResponse::success(new ColdStorageResource($facility));
    }

    public function update(UpdateColdStorageRequest $request, int $storageId): JsonResponse
    {
        $facility = $this->storage->updateStorage(
            (int) $request->user()->id,
            $storageId,
            $this->attributes($request->validated()),
        );

        return ApiResponse::success(
            new ColdStorageResource($facility),
            'Cold storage facility updated.',
        );
    }

    public function destroy(Request $request, int $storageId): JsonResponse
    {
        $this->storage->deleteStorage((int) $request->user()->id, $storageId);

        return ApiResponse::success(null, 'Cold storage facility deleted.');
    }

    public function mine(Request $request): JsonResponse
    {
        return ApiResponse::success(
            ColdStorageResource::collection(
                $this->storage->myStorages((int) $request->user()->id),
            ),
        );
    }

    public function dashboard(Request $request): JsonResponse
    {
        return ApiResponse::success(
            new ColdStorageDashboardResource(
                $this->storage->dashboard((int) $request->user()->id),
            ),
        );
    }

    public function monitoring(Request $request, int $storageId): JsonResponse
    {
        return ApiResponse::success(
            new StorageMonitoringResource(
                $this->storage->monitorStorage($storageId),
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
            'description' => 'description',
            'contactPhone' => 'contact_phone',
            'pincode' => 'pincode',
            'districtId' => 'district_id',
            'talukaId' => 'taluka_id',
            'villageId' => 'village_id',
            'lat' => 'lat',
            'lng' => 'lng',
            'capacityTonnes' => 'capacity_tonnes',
            'tempRangeC' => 'temp_range_c',
            'minTempC' => 'min_temp_c',
            'maxTempC' => 'max_temp_c',
            'humidityRange' => 'humidity_range',
            'supportedCrops' => 'supported_crops',
            'ratePerTonneMonth' => 'rate_per_tonne_month',
            'isActive' => 'is_active',
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
            'districtId' => 'district_id',
            'talukaId' => 'taluka_id',
            'villageId' => 'village_id',
            'cropId' => 'crop_id',
            'minPrice' => 'min_price',
            'maxPrice' => 'max_price',
            'minTemp' => 'min_temp',
            'maxTemp' => 'max_temp',
            'hasCapacity' => 'has_capacity',
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
