<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\WeatherAlert;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin WeatherAlert */
class WeatherAlertsResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'alertType' => $this->alert_type,
            'severity' => $this->severity,
            'districtId' => (int) $this->district_id,
            'title' => $this->title,
            'message' => $this->message,
            'validFrom' => $this->valid_from?->toIso8601String(),
            'validUntil' => $this->valid_until?->toIso8601String(),
            'issuedBy' => (int) $this->issued_by,
        ];
    }
}
