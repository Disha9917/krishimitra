<?php

declare(strict_types=1);

namespace App\Services\AIAdvisory\Contracts;

use App\Models\AiAdvisory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

interface AIHistoryServiceInterface
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function history(int $userId, array $filters): Collection;

    /**
     * @throws ModelNotFoundException
     */
    public function show(int $userId, int $id): AiAdvisory;

    public function destroy(int $userId, int $id): void;

    public function favorite(int $userId, int $id): AiAdvisory;

    public function unfavorite(int $userId, int $id): AiAdvisory;

    public function favorites(int $userId, int $limit): Collection;

    /**
     * @param  array{rating: int, helpful: bool, comment: string}  $feedback
     */
    public function feedback(int $userId, int $id, array $feedback): AiAdvisory;
}
