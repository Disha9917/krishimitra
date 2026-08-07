<?php

declare(strict_types=1);

namespace App\Services\Common\DTO;

use App\Models\TransportCalculation;

/**
 * Immutable transport quotation computed by the TransportService.
 */
final readonly class TransportQuoteDTO
{
    public function __construct(
        public string $origin,
        public string $destination,
        public float $quantityKg,
        public ?float $distanceKm = null,
        public ?float $transitHours = null,
        public ?int $vehicleTypeId = null,
        public ?string $vehicleTypeName = null,
        public ?float $transportCost = null,
        public ?float $estimatedPriceAtDestination = null,
        public ?float $grossRevenue = null,
        public ?float $netProfit = null,
        public ?float $profitMarginPct = null,
    ) {
    }

    public static function fromModel(TransportCalculation $calculation): self
    {
        return new self(
            origin: (string) $calculation->origin,
            destination: (string) $calculation->destination,
            quantityKg: (float) $calculation->quantity_kg,
            distanceKm: $calculation->distance_km !== null ? (float) $calculation->distance_km : null,
            transitHours: $calculation->transit_hours !== null ? (float) $calculation->transit_hours : null,
            vehicleTypeId: $calculation->transport_type_id,
            transportCost: $calculation->transport_cost !== null ? (float) $calculation->transport_cost : null,
            estimatedPriceAtDestination: $calculation->estimated_price_at_destination !== null
                ? (float) $calculation->estimated_price_at_destination
                : null,
            grossRevenue: $calculation->gross_revenue !== null ? (float) $calculation->gross_revenue : null,
            netProfit: $calculation->net_profit !== null ? (float) $calculation->net_profit : null,
            profitMarginPct: $calculation->profit_margin_pct !== null ? (float) $calculation->profit_margin_pct : null,
        );
    }
}
