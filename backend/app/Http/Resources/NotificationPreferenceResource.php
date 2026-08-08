<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\NotificationPreference;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin NotificationPreference */
class NotificationPreferenceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'userId' => (int) $this->user_id,
            'preferences' => [
                'weatherAlerts' => (bool) $this->weather_alerts,
                'diseaseAlerts' => (bool) $this->disease_alerts,
                'marketAlerts' => (bool) $this->market_alerts,
                'governmentSchemeAlerts' => (bool) $this->government_scheme_alerts,
                'equipmentAlerts' => (bool) $this->equipment_alerts,
                'coldStorageAlerts' => (bool) $this->cold_storage_alerts,
                'transportAlerts' => (bool) $this->transport_alerts,
                'aiAdvisoryAlerts' => (bool) $this->ai_advisory_alerts,
                'systemAlerts' => (bool) $this->system_alerts,
                'emailEnabled' => (bool) $this->email_enabled,
            ],
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
