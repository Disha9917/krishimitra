<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\ChatHistory;
use App\Repositories\Contracts\ChatHistoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentChatHistoryRepository extends BaseEloquentRepository implements ChatHistoryRepositoryInterface
{
    public function __construct(ChatHistory $model)
    {
        parent::__construct($model);
    }

    public function historyForConversation(string $conversationId): Collection
    {
            return $this->model
                ->where('conversation_id', $conversationId)
                ->orderBy('id')
                ->get();
    }

    public function historyForUser(int $userId): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->orderByDesc('id')
                ->get();
    }
}
