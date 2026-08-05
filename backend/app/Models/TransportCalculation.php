<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransportCalculation extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'origin',
        'destination',
        'quantity_kg',
        'transport_type_id',
        'distance_km',
        'transport_cost',
        'estimated_price_at_destination',
        'gross_revenue',
        'net_profit',
        'profit_margin_pct',
        'transit_hours',
    ];

    protected $casts = [
        'quantity_kg' => 'decimal:2',
        'distance_km' => 'decimal:2',
        'transport_cost' => 'decimal:2',
        'estimated_price_at_destination' => 'decimal:2',
        'gross_revenue' => 'decimal:2',
        'net_profit' => 'decimal:2',
        'profit_margin_pct' => 'decimal:2',
        'transit_hours' => 'decimal:2',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<TransportVehicleType, $this>
     */
    public function transportType(): BelongsTo
    {
        return $this->belongsTo(TransportVehicleType::class, 'transport_type_id');
    }
}
