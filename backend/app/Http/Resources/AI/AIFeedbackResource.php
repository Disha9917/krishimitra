<?php

declare(strict_types=1);

namespace App\Http\Resources\AI;

use App\Models\AiAdvisory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin AiAdvisory
 */
class AIFeedbackResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'advisoryId' => (int) $this->id,
            'rating' => $this->rating,
            'helpful' => $this->helpful,
            'comment' => $this->feedback_comment,
            'submittedAt' => $this->feedback_at?->toISOString(),
        ];
    }
}
