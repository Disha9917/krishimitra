<?php

declare(strict_types=1);

namespace App\Http\Resources\AI;

use App\Models\AiAdvisory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin AiAdvisory
 */
class HistoryResource extends JsonResource
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
            'topic' => (string) ($snapshot['topic'] ?? ''),
            'provider' => $this->provider,
            'modelVersion' => $this->model_version,
            'response' => $this->response_content,
            'latencyMs' => $this->latency_ms,
            'generatedAt' => $this->generated_at?->toISOString(),
        ];
    }
}
