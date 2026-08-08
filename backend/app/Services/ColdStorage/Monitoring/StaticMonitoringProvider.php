<?php

declare(strict_types=1);

namespace App\Services\ColdStorage\Monitoring;

use App\Models\ColdStorage;

/**
 * Default provider: no sensors attached yet — telemetry stays null.
 */
class StaticMonitoringProvider implements ColdStorageIoTInterface
{
    public function readings(ColdStorage $storage): array
    {
        return [
            'current_temp_c' => null,
            'current_humidity' => null,
            'sensor_online' => false,
            'reported_at' => null,
        ];
    }
}
