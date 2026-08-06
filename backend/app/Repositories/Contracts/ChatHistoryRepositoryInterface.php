<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\ChatHistory;
use Illuminate\Database\Eloquent\Collection;

interface ChatHistoryRepositoryInterface extends BaseRepositoryInterface
{

    public function historyForConversation(string $conversationId): Collection;

    public function historyForUser(int $userId): Collection;
}
