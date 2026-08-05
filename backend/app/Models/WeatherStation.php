<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class WeatherStation extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'district_id',
        'lat',
        'lng',
        'provider',
    ];

    protected $casts = [
        'lat' => 'decimal:6',
        'lng' => 'decimal:6',
    ];

    /**
     * @return BelongsTo<District, $this>
     */
    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class, 'district_id');
    }

    /**
     * @return HasMany<WeatherCache, $this>
     */
    public function weatherCaches(): HasMany
    {
        return $this->hasMany(WeatherCache::class, 'station_id');
    }

    /**
     * @return HasMany<WeatherForecast, $this>
     */
    public function weatherForecasts(): HasMany
    {
        return $this->hasMany(WeatherForecast::class, 'station_id');
    }
}
