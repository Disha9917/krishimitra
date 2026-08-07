<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\FarmerCrop;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin FarmerCrop */
class CropDetailResource extends JsonResource
{
    /**
     * @param  array<string, mixed>|null  $growth
     * @param  array<string, mixed>|null  $status
     */
    public function __construct(
        mixed $resource,
        private readonly ?array $growth = null,
        private readonly ?array $status = null,
    ) {
        parent::__construct($resource);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $base = (new FarmerCropResource($this->resource))->toArray($request);

        $base['growthStage'] = $this->growth['stage'] ?? null;
        $base['growthProgressPercent'] = $this->growth['progress_percent'] ?? null;
        $base['status'] = $this->status['status'] ?? null;
        $base['isOverdue'] = $this->status['is_overdue'] ?? false;
        $base['harvestCount'] = $this->harvests !== null ? $this->harvests->count() : 0;

        return $base;
    }
}
