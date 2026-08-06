<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Notification */
class WeatherNotificationsResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'message' => $this->message,
            'sourceRef' => $this->source_ref,
            'isRead' => (bool) $this->is_read,
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
