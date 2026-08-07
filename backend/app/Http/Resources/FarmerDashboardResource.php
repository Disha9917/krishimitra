<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Services\Common\DTO\FarmerDashboardDTO;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin FarmerDashboardDTO */
class FarmerDashboardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'profile' => $this->profile !== null ? new FarmerProfileResource($this->profile) : null,
            'fields' => FarmerFieldResource::collection($this->fields),
            'crops' => FarmerCropResource::collection($this->crops),
            'harvests' => $this->harvests,
            'detections' => $this->detections,
            'unreadNotifications' => $this->unreadCount,
        ];
    }
}
