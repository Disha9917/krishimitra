<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DownloadReportRequest;
use App\Http\Requests\GenerateReportRequest;
use App\Http\Requests\ListReportsRequest;
use App\Http\Resources\ReportResource;
use App\Services\Report\ReportServiceInterface;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function __construct(
        private readonly ReportServiceInterface $reports,
    ) {
    }

    public function store(GenerateReportRequest $request): JsonResponse
    {
        $report = $this->reports->generate(
            (int) $request->user()->id,
            $request->validated('report_type'),
            $request->validated('filters') ?? [],
            $request->validated('format'),
        );

        return ApiResponse::success(new ReportResource($report, withData: true), 'Report generated successfully.', 201);
    }

    public function index(ListReportsRequest $request): JsonResponse
    {
        $userId = (int) $request->user()->id;
        $reportType = $request->validated('report_type');

        $reports = $request->boolean('favorite')
            ? $this->reports->favoriteReports($userId)
            : $this->reports->history($userId, $reportType, (int) ($request->validated('limit') ?? config('report.default_limit')));

        return ApiResponse::success(ReportResource::collection($reports));
    }

    public function recent(Request $request): JsonResponse
    {
        return ApiResponse::success(ReportResource::collection(
            $this->reports->recentReports((int) $request->user()->id, (int) config('report.recent_limit')),
        ));
    }

    public function favorites(Request $request): JsonResponse
    {
        return ApiResponse::success(ReportResource::collection(
            $this->reports->favoriteReports((int) $request->user()->id),
        ));
    }

    public function show(Request $request, int $reportId): JsonResponse
    {
        $report = $this->reports->previewReport((int) $request->user()->id, $reportId);

        if ($report === null) {
            return ApiResponse::error('Report not found.', 404);
        }

        return ApiResponse::success(new ReportResource($report, withData: true));
    }

    public function download(DownloadReportRequest $request, int $reportId): BinaryFileResponse|StreamedResponse|JsonResponse
    {
        $format = $request->validated('format');

        $file = $this->reports->download(
            (int) $request->user()->id,
            $reportId,
            $format,
            $request->ip(),
        );

        if ($file === null) {
            return ApiResponse::error('Report not found.', 404);
        }

        return Storage::disk($file['disk'])->download($file['path'], $file['filename']);
    }

    public function favorite(Request $request, int $reportId): JsonResponse
    {
        $report = $this->reports->toggleFavorite((int) $request->user()->id, $reportId);

        if ($report === null) {
            return ApiResponse::error('Report not found.', 404);
        }

        return ApiResponse::success(new ReportResource($report), 'Report favorite status updated.');
    }

    public function destroy(Request $request, int $reportId): JsonResponse
    {
        if (!$this->reports->removeReport((int) $request->user()->id, $reportId)) {
            return ApiResponse::error('Report not found.', 404);
        }

        return ApiResponse::success(null, 'Report deleted successfully.');
    }
}
