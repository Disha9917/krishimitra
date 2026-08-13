<?php

declare(strict_types=1);

namespace App\Services\ColdStorage\Payments;

use App\Models\ColdStorageBooking;

/**
 * Payment gateway contract for cold storage bookings.
 *
 * Swap the concrete binding in ServiceServiceProvider to plug in a real
 * gateway (Razorpay, UPI, etc.) without touching any controller or service.
 */
interface ColdStoragePaymentGatewayInterface
{
    /**
     * @param  array<string, mixed>  $payload
     * @return array{status: string, method: string|null, transaction_reference: string|null}
     */
    public function process(ColdStorageBooking $booking, array $payload): array;
}
