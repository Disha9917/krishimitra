<?php

declare(strict_types=1);

namespace App\Services\AI;

use App\Models\AiAdvisory;
use App\Models\PredictionHistory;
use App\Repositories\Contracts\AiAdvisoryRepositoryInterface;
use App\Repositories\Contracts\PredictionHistoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class AIService implements AIServiceInterface
{
    private const MODEL_VERSION = 'fasaldrishti-ai-v1';

    public function __construct(
        private readonly AiAdvisoryRepositoryInterface $advisories,
        private readonly PredictionHistoryRepositoryInterface $predictions,
    ) {
    }

    public function generateAdvisory(int $userId, string $advisoryType, array $payload): AiAdvisory
    {
        $advisory = $this->advisories->create([
            'user_id' => $userId,
            'farmer_crop_id' => $payload['farmer_crop_id'] ?? null,
            'crop_id' => $payload['crop_id'] ?? null,
            'district_id' => $payload['district_id'] ?? null,
            'pincode' => $payload['pincode'] ?? null,
            'input_snapshot' => $payload['input_snapshot'] ?? [],
            'top3_advisories' => $payload['advisories'] ?? [],
            'irrigation_plan' => $payload['irrigation_plan'] ?? [],
            'fertilizer_plan' => $payload['fertilizer_plan'] ?? [],
            'pest_alert' => $payload['pest_alert'] ?? [],
            'timeline_7_days' => $payload['timeline_7_days'] ?? [],
            'generated_at' => now(),
            'model_version' => self::MODEL_VERSION,
        ]);

        $this->predictions->create([
            'user_id' => $userId,
            'prediction_type' => $advisoryType,
            'source_table' => 'ai_advisories',
            'source_id' => (int) $advisory->id,
            'crop_id' => $payload['crop_id'] ?? null,
            'prediction' => $payload['advisories'] ?? [],
            'disease_id' => $payload['disease_id'] ?? null,
            'recommendation' => $payload['recommendation'] ?? null,
            'confidence' => $payload['confidence'] ?? null,
            'location' => $payload['location'] ?? null,
            'status' => 'generated',
            'report_id' => null,
            'occurred_at' => now(),
        ]);

        return $advisory;
    }

    public function predictionHistory(int $userId): Collection
    {
        return $this->predictions->historyForUser($userId);
    }

    public function recentPredictions(int $limit = 20): Collection
    {
        return $this->predictions->recent($limit);
    }
}
