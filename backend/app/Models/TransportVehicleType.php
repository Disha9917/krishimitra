<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransportVehicleType extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'min_capacity_kg',
        'max_capacity_kg',
        'rate_per_km_per_qtl',
        'avg_speed_kmph',
        'is_active',
    ];

    protected $casts = [
        'min_capacity_kg' => 'integer',
        'max_capacity_kg' => 'integer',
        'rate_per_km_per_qtl' => 'decimal:3',
        'avg_speed_kmph' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * @return HasMany<TransportCalculation, $this>
     */
    public function transportCalculations(): HasMany
    {
        return $this->hasMany(TransportCalculation::class, 'transport_type_id');
    }
}
