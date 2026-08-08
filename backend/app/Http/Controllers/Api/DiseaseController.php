<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AttachDiseaseImagesRequest;
use App\Http\Requests\DetectionHistoryRequest;
use App\Http\Requests\ListDetectionsRequest;
use App\Http\Requests\StoreDiseaseDetectionRequest;
use App\Http\Requests\UpdateDiseaseDetectionRequest;
use App\Http\Requests\UploadDiseaseImagesRequest;
use App\Http\Resources\DiseaseDashboardResource;
use App\Http\Resources\DiseaseDetectionResource;
use App\Http\Resources\DiseaseTreatmentResource;
use App\Services\Disease\DiseaseServiceInterface;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DiseaseController extends Controller
{
    public function __construct(
        private readonly DiseaseServiceInterface $disease,
    ) {}

    public function index(ListDetectionsRequest $request): JsonResponse
    {
        return ApiResponse::success(
            DiseaseDetectionResource::collection(
                $this->disease->listDetections(
                    (int) $request->user()->id,
                    $this->filters($request->validated()),
                    $this->limit($request),
                ),
            ),
        );
    }

    public function store(StoreDiseaseDetectionRequest $request): JsonResponse
    {
        $detection = $this->disease->createDetection(
            (int) $request->user()->id,
            (int) $request->validated('fieldId'),
            (int) $request->validated('cropId'),
            $this->detectionAttributes($request->validated()),
        );

        return ApiResponse::success(new DiseaseDetectionResource($detection), 'Disease detection recorded successfully.', 201);
    }

    public function show(Request $request, int $detectionId): JsonResponse
    {
        $detection = $this->disease->getDetection((int) $request->user()->id, $detectionId);

        if ($detection === null) {
            return ApiResponse::error('Disease detection not found.', 404, 'disease_detection_not_found');
        }

        return ApiResponse::success(new DiseaseDetectionResource($detection));
    }

    public function update(UpdateDiseaseDetectionRequest $request, int $detectionId): JsonResponse
    {
        $detection = $this->disease->updateDetection(
            (int) $request->user()->id,
            $detectionId,
            $this->detectionAttributes($request->validated()),
        );

        if ($detection === null) {
            return ApiResponse::error('Disease detection could not be updated.', 422, 'disease_detection_update_failed');
        }

        return ApiResponse::success(new DiseaseDetectionResource($detection), 'Disease detection updated successfully.');
    }

    public function destroy(Request $request, int $detectionId): JsonResponse
    {
        if (! $this->disease->deleteDetection((int) $request->user()->id, $detectionId)) {
            return ApiResponse::error('Disease detection could not be deleted.', 422, 'disease_detection_delete_failed');
        }

        return ApiResponse::success(null, 'Disease detection deleted successfully.');
    }

    public function history(DetectionHistoryRequest $request): JsonResponse
    {
        $records = $this->disease->detectionHistory(
            (int) $request->user()->id,
            $this->filters($request->validated()),
            $this->limit($request),
        );

        $history = $records->map(function ($record): array {
            return [
                'id' => (int) $record->id,
                'detectionId' => $record->detection_id !== null ? (int) $record->detection_id : null,
                'field' => $record->field !== null ? [
                    'id' => (int) $record->field->id,
                    'name' => $record->field->name,
                ] : null,
                'crop' => $record->crop !== null ? [
                    'id' => (int) $record->crop->id,
                    'name' => $record->crop->name,
                ] : null,
                'disease' => $record->disease !== null ? [
                    'id' => (int) $record->disease->id,
                    'name' => $record->disease->name,
                ] : null,
                'resolved' => (bool) $record->resolved,
                'recurrenceCount' => $record->recurrence_count,
                'detectedAt' => $record->detection?->detected_at?->toIso8601String(),
                'createdAt' => $record->created_at?->toIso8601String(),
            ];
        });

        return ApiResponse::success($history->values());
    }

    public function dashboard(Request $request): JsonResponse
    {
        return ApiResponse::success(
            new DiseaseDashboardResource($this->disease->diseaseDashboard((int) $request->user()->id)),
        );
    }

    public function treatment(Request $request, int $detectionId): JsonResponse
    {
        $treatment = $this->disease->treatmentForDetection((int) $request->user()->id, $detectionId);

        if ($treatment === null) {
            return ApiResponse::error('Disease detection not found.', 404, 'disease_detection_not_found');
        }

        return ApiResponse::success(new DiseaseTreatmentResource($treatment));
    }

    public function uploadImages(UploadDiseaseImagesRequest $request): JsonResponse
    {
        $files = $this->disease->uploadImages(
            (int) $request->user()->id,
            array_values($request->validated('images')),
        );

        $mapped = array_map(fn ($file): array => [
            'id' => (int) $file->id,
            'uuid' => $file->uuid,
            'url' => Storage::disk($file->disk)->url($file->path),
            'originalName' => $file->original_name,
            'mimeType' => $file->mime_type,
            'sizeBytes' => $file->size_bytes,
        ], $files);

        return ApiResponse::success($mapped, 'Images uploaded successfully.', 201);
    }

    public function attachImages(AttachDiseaseImagesRequest $request, int $detectionId): JsonResponse
    {
        $detection = $this->disease->attachImages(
            (int) $request->user()->id,
            $detectionId,
            $request->validated('imageFileIds'),
        );

        if ($detection === null) {
            return ApiResponse::error('Disease detection not found.', 404, 'disease_detection_not_found');
        }

        return ApiResponse::success(new DiseaseDetectionResource($detection), 'Images attached successfully.');
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function detectionAttributes(array $validated): array
    {
        $map = [
            'diseaseId' => 'disease_id',
            'diseaseName' => 'disease_name',
            'scientificName' => 'scientific_name',
            'description' => 'description',
            'symptoms' => 'symptoms',
            'confidenceScore' => 'confidence_score',
            'severity' => 'severity',
            'detectionSource' => 'detection_source',
            'detectionStatus' => 'detection_status',
            'treatmentSnapshot' => 'treatment_snapshot',
            'modelVersion' => 'model_version',
            'detectedAt' => 'detected_at',
            'imageFileIds' => 'image_file_ids',
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
            'severity' => 'severity',
            'status' => 'status',
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
