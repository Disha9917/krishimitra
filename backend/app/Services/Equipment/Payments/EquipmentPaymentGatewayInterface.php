<?php

declare(strict_types=1);

namespace App\Services\Equipment\Payments;

use App\Models\EquipmentBooking;

/**
 * Payment gateway contract for equipment rentals.
 *
 * Swap the concrete binding in ServiceServiceProvider to plug in a real
 * gateway (Razorpay, UPI, etc.) without touching any controller or service.
 */
interface EquipmentPaymentGatewayInterface
{
    /**
     * Process the payment intent for a booking.
     *
     * @param  array<string, mixed>  $payload
     * @return array{status: string, method: string|null, transaction_reference: string|null}
     */
    public function process(EquipmentBooking $booking, array $payload): array;
}
