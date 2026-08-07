<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mandi extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'state',
        'district_id',
        'pincode',
        'lat',
        'lng',
        'apmc_id_external',
        'is_active',
    ];

    protected $casts = [
        'lat' => 'decimal:6',
        'lng' => 'decimal:6',
        'is_active' => 'boolean',
    ];

    /**
     * @return BelongsTo<District, $this>
     */
    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class, 'district_id');
    }

    /**
     * @return HasMany<MarketPrice, $this>
     */
    public function marketPrices(): HasMany
    {
        return $this->hasMany(MarketPrice::class, 'mandi_id');
    }

    /**
     * @return HasMany<PricePrediction, $this>
     */
    public function pricePredictions(): HasMany
    {
        return $this->hasMany(PricePrediction::class, 'mandi_id');
    }

    /**
     * @return HasMany<NearbyMandi, $this>
     */
    public function nearbyMandis(): HasMany
    {
        return $this->hasMany(NearbyMandi::class, 'mandi_id');
    }
}
