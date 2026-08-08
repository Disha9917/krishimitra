<?php

declare(strict_types=1);

namespace App\Services\ColdStorage\Payments;

use App\Models\ColdStorageBooking;

/**
 * Default gateway: payment is settled offline (cash on drop-off).
 */
class OfflinePaymentGateway implements ColdStoragePaymentGatewayInterface
{
    public function process(ColdStorageBooking $booking, array $payload): array
    {
        return [
            'status' => 'unpaid',
            'method' => 'cash_on_delivery',
            'transaction_reference' => null,
        ];
    }
}
