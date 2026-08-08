<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UnifiedDashboardRequest;
use App\Http\Resources\UnifiedDashboardResource;
use App\Services\Dashboard\UnifiedDashboardServiceInterface;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class UnifiedDashboardController extends Controller
{
    public function __construct(
        private readonly UnifiedDashboardServiceInterface $dashboard,
    ) {
    }

    public function show(UnifiedDashboardRequest $request): JsonResponse
    {
        $userId = (int) $request->user()->id;

        $payload = $request->boolean('refresh')
            ? $this->dashboard->refreshUnifiedDashboard($userId)
            : $this->dashboard->unifiedDashboard($userId);

        $sections = $request->validated('sections');

        if (is_string($sections) && $sections !== '') {
            $payload = array_intersect_key($payload, array_flip(explode(',', $sections)));
        }

        return ApiResponse::success(new UnifiedDashboardResource($payload));
    }
}
