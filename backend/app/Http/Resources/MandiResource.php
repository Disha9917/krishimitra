<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Mandi;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Mandi */
class MandiResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'state' => $this->state,
            'district' => $this->district !== null ? [
                'id' => (int) $this->district->id,
                'name' => $this->district->name,
                'nameGujarati' => $this->district->name_gujarati,
            ] : null,
            'pincode' => $this->pincode,
            'lat' => $this->lat !== null ? (float) $this->lat : null,
            'lng' => $this->lng !== null ? (float) $this->lng : null,
            'distanceKm' => $this->distance_km !== null ? (float) $this->distance_km : null,
            'isActive' => (bool) $this->is_active,
        ];
    }
}
