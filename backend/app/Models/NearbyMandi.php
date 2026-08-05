<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NearbyMandi extends Model
{
    use HasFactory;

    protected $fillable = [
        'origin_key',
        'mandi_id',
        'distance_km',
        'duration_hours',
        'transport_cost_estimate',
        'computed_at',
    ];

    protected $casts = [
        'distance_km' => 'decimal:2',
        'duration_hours' => 'decimal:2',
        'transport_cost_estimate' => 'decimal:2',
        'computed_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<Mandi, $this>
     */
    public function mandi(): BelongsTo
    {
        return $this->belongsTo(Mandi::class, 'mandi_id');
    }
}
