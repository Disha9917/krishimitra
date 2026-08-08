<?php

declare(strict_types=1);

namespace App\Http\Resources\AI;

use App\Services\AIAdvisory\DTO\AdvisoryResponseDTO;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdvisoryResource extends JsonResource
{
    /**
     * @param  AdvisoryResponseDTO  $resource
     */
    public function toArray(Request $request): array
    {
        /** @var AdvisoryResponseDTO $response */
        $response = $this->resource;

        return [
            'content' => $response->content,
            'provider' => $response->provider,
            'model' => $response->model,
            'usage' => [
                'inputTokens' => $response->usage['input_tokens'] ?? 0,
                'outputTokens' => $response->usage['output_tokens'] ?? 0,
                'totalTokens' => $response->usage['total_tokens'] ?? 0,
            ],
            'latencyMs' => $response->latencyMs,
            'createdAt' => $response->createdAt->toIso8601String(),
        ];
    }
}
