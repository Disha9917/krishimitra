<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFieldRequest;
use App\Http\Requests\UpdateFieldRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\FarmerDashboardResource;
use App\Http\Resources\FarmerFieldResource;
use App\Http\Resources\FarmerProfileResource;
use App\Services\Farmer\FarmerServiceInterface;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FarmerController extends Controller
{
    public function __construct(
        private readonly FarmerServiceInterface $farmer,
    ) {}

    public function profile(Request $request): JsonResponse
    {
        $profile = $this->farmer->getProfile((int) $request->user()->id);

        if ($profile === null) {
            return ApiResponse::error('Farmer profile not found. Please complete your profile first.', 404, 'profile_not_found');
        }

        return ApiResponse::success(new FarmerProfileResource($profile));
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $attributes = $this->profileAttributes($request->validated());
        $profile = $this->farmer->updateProfile((int) $request->user()->id, $attributes);

        if ($profile === null) {
            return ApiResponse::error('Profile could not be saved.', 422, 'profile_update_failed');
        }

        return ApiResponse::success(new FarmerProfileResource($profile), 'Profile updated successfully.');
    }

    public function dashboard(Request $request): JsonResponse
    {
        $dashboard = $this->farmer->dashboard((int) $request->user()->id);

        return ApiResponse::success(new FarmerDashboardResource($dashboard));
    }

    public function indexFields(Request $request): JsonResponse
    {
        return ApiResponse::success(
            FarmerFieldResource::collection($this->farmer->fieldsForUser((int) $request->user()->id)),
        );
    }

    public function storeField(StoreFieldRequest $request): JsonResponse
    {
        $field = $this->farmer->addField((int) $request->user()->id, $this->fieldAttributes($request->validated()));

        return ApiResponse::success(new FarmerFieldResource($field), 'Field created successfully.', 201);
    }

    public function showField(Request $request, int $fieldId): JsonResponse
    {
        $field = $this->farmer->getField((int) $request->user()->id, $fieldId);

        if ($field === null) {
            return ApiResponse::error('Field not found.', 404, 'field_not_found');
        }

        return ApiResponse::success(new FarmerFieldResource($field));
    }

    public function updateField(UpdateFieldRequest $request, int $fieldId): JsonResponse
    {
        $field = $this->farmer->updateField((int) $request->user()->id, $fieldId, $this->fieldAttributes($request->validated()));

        if ($field === null) {
            return ApiResponse::error('Field could not be updated.', 422, 'field_update_failed');
        }

        return ApiResponse::success(new FarmerFieldResource($field), 'Field updated successfully.');
    }

    public function deleteField(Request $request, int $fieldId): JsonResponse
    {
        $deleted = $this->farmer->deleteField((int) $request->user()->id, $fieldId);

        if (! $deleted) {
            return ApiResponse::error('Field could not be deleted.', 422, 'field_delete_failed');
        }

        return ApiResponse::success(null, 'Field deleted successfully.');
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function profileAttributes(array $validated): array
    {
        $map = [
            'fullName' => 'full_name',
            'preferredLanguage' => 'preferred_language',
            'farmSizeAcres' => 'farm_size_acres',
            'primaryCropId' => 'primary_crop_id',
            'pinCode' => 'pincode',
            'state' => 'state',
            'districtId' => 'district_id',
            'talukaId' => 'taluka_id',
            'village' => 'village',
            'alertPreferences' => 'alert_preferences',
        ];

        return $this->mapAttributes($validated, $map);
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function fieldAttributes(array $validated): array
    {
        $map = [
            'name' => 'name',
            'sizeAcres' => 'size_acres',
            'soilTypeId' => 'soil_type_id',
            'currentCropId' => 'current_crop_id',
            'lat' => 'lat',
            'lng' => 'lng',
        ];

        return $this->mapAttributes($validated, $map);
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function mapAttributes(array $validated, array $map): array
    {
        $attributes = [];

        foreach ($map as $requestKey => $modelKey) {
            if (array_key_exists($requestKey, $validated)) {
                $attributes[$modelKey] = $validated[$requestKey];
            }
        }

        return $attributes;
    }
}
