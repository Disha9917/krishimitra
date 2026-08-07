<?php

declare(strict_types=1);

namespace App\Services\AI;

use App\Models\AiAdvisory;
use App\Models\PredictionHistory;
use Illuminate\Database\Eloquent\Collection;

interface AIServiceInterface
{
    /**
     * Persist an AI advisory and mirror it into the prediction history trail.
     */
    public function generateAdvisory(int $userId, string $advisoryType, array $payload): AiAdvisory;

    /**
     * A user's prediction history across all AI features.
     */
    public function predictionHistory(int $userId): Collection;

    /**
     * Most recent predictions across all users.
     */
    public function recentPredictions(int $limit = 20): Collection;
}
