<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin array{storage: \App\Models\ColdStorage, telemetry: array<string, mixed>}
 */
class StorageMonitoringResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $storage = $this['storage'];
        $telemetry = $this['telemetry'];

        return [
            'storageId' => (int) $storage->id,
            'storageName' => $storage->name,
            'telemetry' => [
                'currentTempC' => $telemetry['current_temp_c'],
                'currentHumidity' => $telemetry['current_humidity'],
                'sensorOnline' => $telemetry['sensor_online'],
                'reportedAt' => $telemetry['reported_at'],
            ],
            'configuredRange' => [
                'minTempC' => $storage->min_temp_c !== null ? (float) $storage->min_temp_c : null,
                'maxTempC' => $storage->max_temp_c !== null ? (float) $storage->max_temp_c : null,
                'humidityRange' => $storage->humidity_range,
            ],
            'capacity' => [
                'capacityTonnes' => (float) $storage->capacity_tonnes,
                'occupiedTonnes' => (float) $storage->occupied_tonnes,
                'availableTonnes' => (float) $storage->availableCapacity(),
            ],
        ];
    }
}
