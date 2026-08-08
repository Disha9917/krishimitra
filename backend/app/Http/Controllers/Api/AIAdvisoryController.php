<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AI\AdvisoryRequest;
use App\Http\Requests\AI\HistoryRequest;
use App\Http\Resources\AI\AdvisoryResource;
use App\Http\Resources\AI\AIProviderResource;
use App\Http\Resources\AI\HistoryResource;
use App\Services\AIAdvisory\Contracts\AIAdvisoryServiceInterface;
use App\Services\AIAdvisory\DTO\AdvisoryRequestDTO;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AIAdvisoryController extends Controller
{
    public function __construct(
        private readonly AIAdvisoryServiceInterface $advisories,
    ) {}

    public function store(AdvisoryRequest $request): JsonResponse
    {
        $response = $this->advisories->requestAdvisory(
            (int) $request->user()->id,
            AdvisoryRequestDTO::fromValidated($request->validated()),
        );

        return ApiResponse::success(new AdvisoryResource($response), 'Advisory request processed.', 201);
    }

    public function index(HistoryRequest $request): JsonResponse
    {
        return ApiResponse::success(HistoryResource::collection(
            $this->advisories->history(
                (int) $request->user()->id,
                $request->validated('advisory_type'),
                (int) ($request->validated('limit') ?? config('ai.history_limit')),
            ),
        ));
    }

    public function providers(Request $request): JsonResponse
    {
        return ApiResponse::success(AIProviderResource::collection(
            collect($this->advisories->providers()),
        ));
    }
}
