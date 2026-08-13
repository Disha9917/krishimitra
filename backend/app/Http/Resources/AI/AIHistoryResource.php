<?php

declare(strict_types=1);

namespace App\Http\Resources\AI;

use App\Models\AiAdvisory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin AiAdvisory
 */
class AIHistoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $snapshot = (array) ($this->input_snapshot ?? []);

        return [
            'id' => (int) $this->id,
            'advisoryType' => (string) ($this->advisory_type ?? $snapshot['advisory_type'] ?? 'general'),
            'topic' => (string) ($this->topic ?? $snapshot['topic'] ?? ''),
            'provider' => $this->provider,
            'modelVersion' => $this->model_version,
            'riskLevel' => $this->risk_level,
            'confidence' => $this->confidence !== null ? (float) $this->confidence : null,
            'prompt' => $this->prompt_text,
            'contextSnapshot' => $this->context_snapshot ?? [],
            'response' => $this->response_content,
            'usage' => $this->usage ?? [],
            'latencyMs' => $this->latency_ms,
            'isFavorite' => (bool) $this->is_favorite,
            'feedback' => [
                'rating' => $this->rating,
                'helpful' => $this->helpful,
                'comment' => $this->feedback_comment,
                'submittedAt' => $this->feedback_at?->toISOString(),
            ],
            'generatedAt' => $this->generated_at?->toISOString(),
            'deletedAt' => $this->deleted_at?->toISOString(),
        ];
    }
}
