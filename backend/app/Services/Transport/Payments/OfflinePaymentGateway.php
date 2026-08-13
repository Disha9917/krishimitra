<?php

declare(strict_types=1);

namespace App\Services\Transport\Payments;

use App\Models\TransportBooking;

/**
 * Default gateway: payment is settled offline (cash on delivery).
 */
class OfflinePaymentGateway implements TransportPaymentGatewayInterface
{
    public function process(TransportBooking $booking, array $payload): array
    {
        return [
            'status' => 'unpaid',
            'method' => 'cash_on_delivery',
            'transaction_reference' => null,
        ];
    }
}
