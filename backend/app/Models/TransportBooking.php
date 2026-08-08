<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransportBooking extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'transport_bookings';

    protected $fillable = [
        'uuid',
        'user_id',
        'vehicle_id',
        'vehicle_type_id',
        'quantity_kg',
        'distance_km',
        'pickup_location',
        'dropoff_location',
        'pickup_at',
        'dropoff_at',
        'base_cost',
        'loading_charges',
        'toll_charges',
        'fuel_charges',
        'total_amount',
        'status',
        'payment_status',
        'payment_method',
        'transaction_reference',
        'reason',
        'cancelled_at',
        'decided_at',
        'completed_at',
    ];

    protected $casts = [
        'quantity_kg' => 'decimal:2',
        'distance_km' => 'decimal:2',
        'pickup_at' => 'datetime',
        'dropoff_at' => 'datetime',
        'base_cost' => 'decimal:2',
        'loading_charges' => 'decimal:2',
        'toll_charges' => 'decimal:2',
        'fuel_charges' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'cancelled_at' => 'datetime',
        'decided_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * The columns that should receive a UUID (the primary key stays BIGINT).
     *
     * @return list<string>
     */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<Vehicle, $this>
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id');
    }

    /**
     * @return BelongsTo<TransportVehicleType, $this>
     */
    public function vehicleType(): BelongsTo
    {
        return $this->belongsTo(TransportVehicleType::class, 'vehicle_type_id');
    }
}
