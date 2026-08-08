<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ListSoilTestsRequest;
use App\Http\Requests\SoilHistoryRequest;
use App\Http\Requests\StoreSoilTestRequest;
use App\Http\Requests\UpdateSoilTestRequest;
use App\Http\Resources\SoilDashboardResource;
use App\Http\Resources\SoilHealthResource;
use App\Http\Resources\SoilHistoryResource;
use App\Http\Resources\SoilRecommendationResource;
use App\Http\Resources\SoilTestResource;
use App\Services\Soil\SoilServiceInterface;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SoilController extends Controller
{
    public function __construct(
        private readonly SoilServiceInterface $soil,
    ) {}

    public function index(ListSoilTestsRequest $request): JsonResponse
    {
        return ApiResponse::success(
            SoilTestResource::collection(
                $this->soil->listSoilTests(
                    (int) $request->user()->id,
                    $this->filters($request->validated()),
                    $this->limit($request),
                ),
            ),
        );
    }

    public function store(StoreSoilTestRequest $request): JsonResponse
    {
        $test = $this->soil->createSoilTest(
            (int) $request->user()->id,
            (int) $request->validated('fieldId'),
            $this->testAttributes($request->validated()),
        );

        return ApiResponse::success(new SoilTestResource($test), 'Soil test recorded successfully.', 201);
    }

    public function show(Request $request, int $testId): JsonResponse
    {
        $test = $this->soil->getSoilTest((int) $request->user()->id, $testId);

        if ($test === null) {
            return ApiResponse::error('Soil test not found.', 404, 'soil_test_not_found');
        }

        return ApiResponse::success(new SoilTestResource($test));
    }

    public function update(UpdateSoilTestRequest $request, int $testId): JsonResponse
    {
        $test = $this->soil->updateSoilTest(
            (int) $request->user()->id,
            $testId,
            $this->testAttributes($request->validated()),
        );

        if ($test === null) {
            return ApiResponse::error('Soil test could not be updated.', 422, 'soil_test_update_failed');
        }

        return ApiResponse::success(new SoilTestResource($test), 'Soil test updated successfully.');
    }

    public function destroy(Request $request, int $testId): JsonResponse
    {
        if (! $this->soil->deleteSoilTest((int) $request->user()->id, $testId)) {
            return ApiResponse::error('Soil test could not be deleted.', 422, 'soil_test_delete_failed');
        }

        return ApiResponse::success(null, 'Soil test deleted successfully.');
    }

    public function history(SoilHistoryRequest $request): JsonResponse
    {
        return ApiResponse::success(
            SoilHistoryResource::collection(
                $this->soil->soilHistory(
                    (int) $request->user()->id,
                    $this->filters($request->validated()),
                    $this->limit($request),
                ),
            ),
        );
    }

    public function health(Request $request, int $fieldId): JsonResponse
    {
        $health = $this->soil->soilHealth((int) $request->user()->id, $fieldId);

        return ApiResponse::success(new SoilHealthResource($health));
    }

    public function dashboard(Request $request): JsonResponse
    {
        return ApiResponse::success(
            new SoilDashboardResource($this->soil->soilDashboard((int) $request->user()->id)),
        );
    }

    public function recommendations(Request $request, int $testId): JsonResponse
    {
        $recommendations = $this->soil->soilRecommendations((int) $request->user()->id, $testId);

        if ($recommendations === null) {
            return ApiResponse::error('Soil test not found.', 404, 'soil_test_not_found');
        }

        return ApiResponse::success(new SoilRecommendationResource($recommendations));
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function testAttributes(array $validated): array
    {
        $map = [
            'cropId' => 'crop_id',
            'labName' => 'lab_name',
            'reportDate' => 'report_date',
            'reportFileId' => 'report_file_id',
            'ph' => 'ph',
            'ec' => 'ec',
            'nitrogenKgHa' => 'nitrogen_kg_ha',
            'phosphorusKgHa' => 'phosphorus_kg_ha',
            'potassiumKgHa' => 'potassium_kg_ha',
            'organicCarbonPct' => 'organic_carbon_pct',
            'moisturePct' => 'moisture_pct',
            'micronutrients' => 'micronutrients_json',
            'soilTexture' => 'soil_texture',
            'soilTypeId' => 'soil_type_id',
        ];

        return $this->mapAttributes($validated, $map);
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function filters(array $validated): array
    {
        $map = [
            'fieldId' => 'field_id',
            'cropId' => 'crop_id',
            'from' => 'from',
            'to' => 'to',
        ];

        return $this->mapAttributes($validated, $map);
    }

    private function limit(Request $request): int
    {
        return $request->validated('limit') !== null
            ? (int) $request->validated('limit')
            : 20;
    }

    /**
     * @param  array<string, mixed>  $validated
     * @param  array<string, string>  $map
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
