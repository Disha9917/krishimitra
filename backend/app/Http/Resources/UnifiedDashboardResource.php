<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin array{overview?: mixed, weather?: mixed, soil?: mixed, crop?: mixed, disease?: mixed, market?: mixed, schemes?: mixed, equipment?: mixed, coldStorage?: mixed, transport?: mixed, notifications?: mixed, quickActions?: mixed, statistics?: mixed, cached?: bool, generated_at?: ?string}
 */
class UnifiedDashboardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'overview' => $this['overview'] ?? null,
            'weather' => $this['weather'] ?? null,
            'soil' => $this['soil'] ?? null,
            'crop' => $this['crop'] ?? null,
            'disease' => $this['disease'] ?? null,
            'market' => $this['market'] ?? null,
            'schemes' => $this['schemes'] ?? null,
            'equipment' => $this['equipment'] ?? null,
            'coldStorage' => $this['coldStorage'] ?? null,
            'transport' => $this['transport'] ?? null,
            'notifications' => $this['notifications'] ?? null,
            'quickActions' => $this['quickActions'] ?? null,
            'statistics' => $this['statistics'] ?? null,
            'cached' => (bool) ($this['cached'] ?? false),
            'generatedAt' => $this['generated_at'] ?? null,
        ];
    }
}
