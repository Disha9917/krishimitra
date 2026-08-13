<?php

declare(strict_types=1);

namespace App\Services\Equipment\Payments;

use App\Models\EquipmentBooking;

/**
 * Default gateway: payment is settled offline (cash on pickup).
 */
class OfflinePaymentGateway implements EquipmentPaymentGatewayInterface
{
    public function process(EquipmentBooking $booking, array $payload): array
    {
        return [
            'status' => 'unpaid',
            'method' => 'cash_on_pickup',
            'transaction_reference' => null,
        ];
    }
}
