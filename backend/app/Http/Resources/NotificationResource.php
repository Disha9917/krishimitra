<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Notification */
class NotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'uuid' => $this->uuid,
            'type' => $this->type,
            'title' => $this->title,
            'message' => $this->message,
            'actionUrl' => $this->action_url,
            'sourceRef' => $this->source_ref,
            'isRead' => (bool) $this->is_read,
            'readAt' => $this->read_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
