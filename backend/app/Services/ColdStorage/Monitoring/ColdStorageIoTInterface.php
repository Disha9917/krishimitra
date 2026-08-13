<?php

declare(strict_types=1);

namespace App\Services\ColdStorage\Monitoring;

use App\Models\ColdStorage;

/**
 * IoT telemetry contract for cold storage facilities.
 *
 * Swap the concrete binding in ServiceServiceProvider to plug in real
 * sensor feeds (temperature/humidity/live capacity) without touching
 * any controller or service.
 */
interface ColdStorageIoTInterface
{
    /**
     * Fetch live telemetry for a facility.
     *
     * @return array{current_temp_c: float|null, current_humidity: float|null, sensor_online: bool, reported_at: string|null}
     */
    public function readings(ColdStorage $storage): array;
}
