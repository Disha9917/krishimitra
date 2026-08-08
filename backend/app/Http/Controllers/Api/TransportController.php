<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ListVehiclesRequest;
use App\Http\Requests\RouteEstimateRequest;
use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\TransportCostEstimateRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Http\Resources\RouteEstimateResource;
use App\Http\Resources\TransportCostResource;
use App\Http\Resources\TransportDashboardResource;
use App\Http\Resources\VehicleResource;
use App\Services\Transport\TransportServiceInterface;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransportController extends Controller
{
    public function __construct(
        private readonly TransportServiceInterface $transport,
    ) {}

    public function index(ListVehiclesRequest $request): JsonResponse
    {
        return ApiResponse::success(
            VehicleResource::collection(
                $this->transport->listVehicles(
                    $this->filters($request->validated()),
                    $this->limit($request),
                ),
            ),
        );
    }

    public function store(StoreVehicleRequest $request): JsonResponse
    {
        $vehicle = $this->transport->createVehicle(
            (int) $request->user()->id,
            $this->attributes($request->validated()),
        );

        return ApiResponse::success(
            new VehicleResource($vehicle),
            'Vehicle registered.',
            201,
        );
    }

    public function show(Request $request, int $vehicleId): JsonResponse
    {
        $vehicle = $this->transport->findVehicle($vehicleId);

        if ($vehicle === null) {
            return ApiResponse::error('Vehicle not found.', 404, 'vehicle_not_found');
        }

        return ApiResponse::success(new VehicleResource($vehicle));
    }

    public function update(UpdateVehicleRequest $request, int $vehicleId): JsonResponse
    {
        $vehicle = $this->transport->updateVehicle(
            (int) $request->user()->id,
            $vehicleId,
            $this->attributes($request->validated()),
        );

        return ApiResponse::success(
            new VehicleResource($vehicle),
            'Vehicle updated.',
        );
    }

    public function destroy(Request $request, int $vehicleId): JsonResponse
    {
        $this->transport->deleteVehicle((int) $request->user()->id, $vehicleId);

        return ApiResponse::success(null, 'Vehicle deleted.');
    }

    public function mine(Request $request): JsonResponse
    {
        return ApiResponse::success(
            VehicleResource::collection(
                $this->transport->myVehicles((int) $request->user()->id),
            ),
        );
    }

    public function dashboard(Request $request): JsonResponse
    {
        return ApiResponse::success(
            new TransportDashboardResource(
                $this->transport->dashboard((int) $request->user()->id),
            ),
        );
    }

    public function costEstimate(TransportCostEstimateRequest $request): JsonResponse
    {
        return ApiResponse::success(
            new TransportCostResource(
                $this->transport->costEstimate(
                    (int) $request->validated('vehicleId'),
                    $this->costAttributes($request->validated()),
                ),
            ),
        );
    }

    public function routeEstimate(RouteEstimateRequest $request): JsonResponse
    {
        return ApiResponse::success(
            new RouteEstimateResource(
                $this->transport->routeEstimate($this->routeAttributes($request->validated())),
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
            'vehicleTypeId' => 'vehicle_type_id',
            'name' => 'name',
            'vehicleNumber' => 'vehicle_number',
            'capacityKg' => 'capacity_kg',
            'pricePerKm' => 'price_per_km',
            'loadingCharges' => 'loading_charges',
            'driverName' => 'driver_name',
            'driverPhone' => 'driver_phone',
            'contactPhone' => 'contact_phone',
            'pincode' => 'pincode',
            'districtId' => 'district_id',
            'talukaId' => 'taluka_id',
            'villageId' => 'village_id',
            'lat' => 'lat',
            'lng' => 'lng',
            'serviceAreas' => 'service_areas',
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
            'districtId' => 'district_id',
            'talukaId' => 'taluka_id',
            'vehicleTypeId' => 'vehicle_type_id',
            'minCapacityKg' => 'min_capacity_kg',
            'maxCapacityKg' => 'max_capacity_kg',
            'isAvailable' => 'is_available',
            'minPrice' => 'min_price',
            'maxPrice' => 'max_price',
            'search' => 'search',
        ];

        return $this->remap($validated, $map);
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function costAttributes(array $validated): array
    {
        $map = [
            'distanceKm' => 'distance_km',
            'quantityKg' => 'quantity_kg',
            'loadingCharges' => 'loading_charges',
            'tollCharges' => 'toll_charges',
            'fuelRatePerLitre' => 'fuel_rate_per_litre',
        ];

        return $this->remap($validated, $map);
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function routeAttributes(array $validated): array
    {
        $map = [
            'origin' => 'origin',
            'destination' => 'destination',
            'originLat' => 'origin_lat',
            'originLng' => 'origin_lng',
            'destinationLat' => 'destination_lat',
            'destinationLng' => 'destination_lng',
            'distanceKm' => 'distance_km',
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
