<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin array{statistics: array<string, int>, expiring_soon: \Illuminate\Database\Eloquent\Collection, recent_applications: \Illuminate\Database\Eloquent\Collection}
 */
class SchemeDashboardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'statistics' => [
                'activeSchemes' => $this['statistics']['active_schemes'],
                'eligibleSchemes' => $this['statistics']['eligible_schemes'],
                'appliedSchemes' => $this['statistics']['applied_schemes'],
                'pendingApplications' => $this['statistics']['pending_applications'],
                'expiringSoonCount' => $this['statistics']['expiring_soon_count'],
            ],
            'expiringSoon' => SchemeResource::collection($this['expiring_soon']),
            'recentApplications' => SchemeApplicationResource::collection($this['recent_applications']),
        ];
    }
}
