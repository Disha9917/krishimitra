<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AI\FavoriteRequest;
use App\Http\Requests\AI\FeedbackRequest;
use App\Http\Requests\AI\HistoryRequest;
use App\Http\Resources\AI\AIFeedbackResource;
use App\Http\Resources\AI\AIHistoryCollection;
use App\Http\Resources\AI\AIHistoryResource;
use App\Services\AIAdvisory\Contracts\AIHistoryServiceInterface;
use App\Support\ApiResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AIHistoryController extends Controller
{
    public function __construct(
        private readonly AIHistoryServiceInterface $history,
    ) {}

    public function index(HistoryRequest $request): JsonResponse
    {
        return ApiResponse::success(new AIHistoryCollection(
            $this->history->history((int) $request->user()->id, $request->filters()),
        ));
    }

    public function show(Request $request, int $id): JsonResponse
    {
        return $this->wrap(fn (int $userId) => ApiResponse::success(
            new AIHistoryResource($this->history->show($userId, $id)),
        ), (int) $request->user()->id);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        return $this->wrap(function (int $userId) use ($id): JsonResponse {
            $this->history->destroy($userId, $id);

            return ApiResponse::success(null, 'Advisory deleted successfully.');
        }, (int) $request->user()->id);
    }

    public function favorite(FavoriteRequest $request, int $id): JsonResponse
    {
        return $this->wrap(fn (int $userId) => ApiResponse::success(
            new AIHistoryResource($this->history->favorite($userId, $id)),
            'Advisory added to favorites.',
        ), (int) $request->user()->id);
    }

    public function unfavorite(FavoriteRequest $request, int $id): JsonResponse
    {
        return $this->wrap(fn (int $userId) => ApiResponse::success(
            new AIHistoryResource($this->history->unfavorite($userId, $id)),
            'Advisory removed from favorites.',
        ), (int) $request->user()->id);
    }

    public function favorites(Request $request): JsonResponse
    {
        $limit = (int) ($request->input('limit') ?? config('ai.history_limit'));

        return ApiResponse::success(
            AIHistoryResource::collection($this->history->favorites(
                (int) $request->user()->id,
                $limit,
            )),
        );
    }

    public function feedback(FeedbackRequest $request, int $id): JsonResponse
    {
        return $this->wrap(fn (int $userId) => ApiResponse::success(
            new AIFeedbackResource($this->history->feedback($userId, $id, $request->feedback())),
            'Feedback submitted successfully.',
        ), (int) $request->user()->id);
    }

    /**
     * Convert ownership/not-found failures into a clean 404 JSON response.
     */
    private function wrap(callable $action, int $userId): JsonResponse
    {
        try {
            return $action($userId);
        } catch (ModelNotFoundException) {
            return ApiResponse::error('Advisory not found.', 404);
        }
    }
}
