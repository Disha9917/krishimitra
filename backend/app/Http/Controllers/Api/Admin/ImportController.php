<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ImportCsvRequest;
use App\Http\Requests\Admin\ListImportHistoryRequest;
use App\Http\Requests\Admin\UploadCsvRequest;
use App\Http\Resources\Admin\ImportHistoryResource;
use App\Http\Resources\Admin\ImportLogResource;
use App\Http\Resources\Admin\ImportReportResource;
use App\Services\Import\Contracts\ImportServiceInterface;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ImportController extends Controller
{
    public function __construct(
        private readonly ImportServiceInterface $imports,
    ) {}

    public function validateCsv(UploadCsvRequest $request): JsonResponse
    {
        $report = $this->imports->validateFile(
            $request->file('file'),
            $request->validated('dataset_type'),
        );

        return ApiResponse::success(new ImportReportResource($report), 'CSV validation completed.');
    }

    public function preview(UploadCsvRequest $request): JsonResponse
    {
        $report = $this->imports->preview(
            $request->file('file'),
            $request->validated('dataset_type'),
        );

        return ApiResponse::success(new ImportReportResource($report), 'CSV preview ready.');
    }

    public function dryRun(UploadCsvRequest $request): JsonResponse
    {
        $report = $this->imports->validateFile(
            $request->file('file'),
            $request->validated('dataset_type'),
        );

        return ApiResponse::success(new ImportReportResource($report), 'Dry run completed — nothing was imported.');
    }

    public function store(ImportCsvRequest $request): JsonResponse
    {
        $history = $this->imports->import(
            (int) $request->user()->id,
            $request->file('file'),
            $request->validated('dataset_type'),
        );

        return ApiResponse::success(new ImportHistoryResource($history), 'Import completed successfully.', 201);
    }

    public function rollback(Request $request, int $importId): JsonResponse
    {
        $history = $this->imports->rollback($importId);

        if ($history === null) {
            return ApiResponse::error('Import not found.', 404);
        }

        return ApiResponse::success(new ImportHistoryResource($history), 'Import rolled back successfully.');
    }

    public function index(ListImportHistoryRequest $request): JsonResponse
    {
        $history = $this->imports->history(
            $request->validated('dataset_type'),
            $request->validated('status'),
            (int) ($request->validated('limit') ?? config('import.history_limit')),
        );

        return ApiResponse::success(ImportHistoryResource::collection($history));
    }

    public function show(Request $request, int $importId): JsonResponse
    {
        $history = $this->imports->find($importId);

        if ($history === null) {
            return ApiResponse::error('Import not found.', 404);
        }

        return ApiResponse::success(new ImportHistoryResource($history), 'Import progress retrieved.');
    }

    public function logs(Request $request, int $importId): JsonResponse
    {
        if ($this->imports->find($importId) === null) {
            return ApiResponse::error('Import not found.', 404);
        }

        return ApiResponse::success(ImportLogResource::collection($this->imports->logs($importId)));
    }
}
