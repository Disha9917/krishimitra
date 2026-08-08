<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApplicationHistoryRequest;
use App\Http\Requests\ListSchemesRequest;
use App\Http\Requests\StoreSchemeApplicationRequest;
use App\Http\Requests\SubmitSchemeApplicationRequest;
use App\Http\Requests\UploadSchemeDocumentsRequest;
use App\Http\Resources\SchemeApplicationResource;
use App\Http\Resources\SchemeDashboardResource;
use App\Http\Resources\SchemeEligibilityResource;
use App\Http\Resources\SchemeResource;
use App\Services\GovernmentScheme\GovernmentSchemeServiceInterface;
use App\Services\GovernmentScheme\Providers\SchemeDataProviderInterface;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GovernmentSchemeController extends Controller
{
    public function __construct(
        private readonly GovernmentSchemeServiceInterface $scheme,
    ) {}

    public function index(ListSchemesRequest $request): JsonResponse
    {
        return ApiResponse::success(
            SchemeResource::collection(
                $this->scheme->listSchemes(
                    $this->filters($request->validated()),
                    $this->limit($request),
                ),
            ),
        );
    }

    public function show(Request $request, int $schemeId): JsonResponse
    {
        $scheme = $this->scheme->findScheme($schemeId);

        if ($scheme === null || ! (bool) $scheme->is_active) {
            return ApiResponse::error('Scheme not found.', 404, 'scheme_not_found');
        }

        return ApiResponse::success(new SchemeResource($scheme));
    }

    public function eligibility(Request $request, int $schemeId): JsonResponse
    {
        $scheme = $this->scheme->findScheme($schemeId);

        if ($scheme === null || ! (bool) $scheme->is_active) {
            return ApiResponse::error('Scheme not found.', 404, 'scheme_not_found');
        }

        return ApiResponse::success(
            new SchemeEligibilityResource(
                $this->scheme->checkEligibility((int) $request->user()->id, $schemeId),
            ),
        );
    }

    public function startApplication(StoreSchemeApplicationRequest $request, int $schemeId): JsonResponse
    {
        $application = $this->scheme->startApplication(
            (int) $request->user()->id,
            $schemeId,
            $this->documents($request->validated()),
        );

        return ApiResponse::success(
            new SchemeApplicationResource($application),
            'Application draft created. Submit it once your documents are ready.',
            201,
        );
    }

    public function submitApplication(SubmitSchemeApplicationRequest $request, int $applicationId): JsonResponse
    {
        $application = $this->scheme->submitApplication(
            (int) $request->user()->id,
            $applicationId,
            $this->documents($request->validated()),
        );

        if ($application === null) {
            return ApiResponse::error('Scheme application not found.', 404, 'scheme_application_not_found');
        }

        return ApiResponse::success(
            new SchemeApplicationResource($application),
            'Scheme application submitted successfully.',
        );
    }

    public function history(ApplicationHistoryRequest $request): JsonResponse
    {
        return ApiResponse::success(
            SchemeApplicationResource::collection(
                $this->scheme->applicationsForUser(
                    (int) $request->user()->id,
                    $this->filters($request->validated()),
                    $this->limit($request),
                ),
            ),
        );
    }

    public function showApplication(Request $request, int $applicationId): JsonResponse
    {
        $application = $this->scheme->getApplication((int) $request->user()->id, $applicationId);

        if ($application === null) {
            return ApiResponse::error('Scheme application not found.', 404, 'scheme_application_not_found');
        }

        return ApiResponse::success(new SchemeApplicationResource($application));
    }

    public function dashboard(Request $request): JsonResponse
    {
        return ApiResponse::success(
            new SchemeDashboardResource(
                $this->scheme->schemeDashboard((int) $request->user()->id),
            ),
        );
    }

    public function uploadDocuments(UploadSchemeDocumentsRequest $request): JsonResponse
    {
        $files = $this->scheme->uploadDocuments(
            (int) $request->user()->id,
            array_values($request->validated('documents')),
        );

        $mapped = array_map(fn ($file): array => [
            'id' => (int) $file->id,
            'uuid' => $file->uuid,
            'url' => Storage::disk($file->disk)->url($file->path),
            'originalName' => $file->original_name,
            'mimeType' => $file->mime_type,
            'sizeBytes' => $file->size_bytes,
        ], $files);

        return ApiResponse::success($mapped, 'Documents uploaded successfully.', 201);
    }

    public function sync(Request $request): JsonResponse
    {
        $request->validate([
            'source' => ['sometimes', 'string', 'in:internal'],
            'state' => ['sometimes', 'nullable', 'string', 'max:50'],
            'category' => ['sometimes', 'nullable', 'string', 'max:80'],
        ]);

        $result = $this->scheme->syncSchemes(
            app(SchemeDataProviderInterface::class),
            $this->filters($request->all()),
        );

        return ApiResponse::success($result, 'Provider sync completed.');
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return list<array{fileId: int, type: string}>
     */
    private function documents(array $validated): array
    {
        $documents = [];

        foreach ((array) ($validated['documents'] ?? []) as $document) {
            if (isset($document['fileId'])) {
                $documents[] = [
                    'fileId' => (int) $document['fileId'],
                    'type' => (string) ($document['type'] ?? 'document'),
                ];
            }
        }

        return $documents;
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function filters(array $validated): array
    {
        $map = [
            'category' => 'category',
            'state' => 'state',
            'districtId' => 'district_id',
            'cropId' => 'crop_id',
            'search' => 'search',
            'status' => 'status',
        ];

        $filters = [];

        foreach ($map as $requestKey => $filterKey) {
            if (array_key_exists($requestKey, $validated) && $validated[$requestKey] !== null) {
                $filters[$filterKey] = $validated[$requestKey];
            }
        }

        return $filters;
    }

    private function limit(Request $request): int
    {
        return $request->validated('limit') !== null
            ? (int) $request->validated('limit')
            : 20;
    }
}
