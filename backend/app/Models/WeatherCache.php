<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WeatherCache extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'weather_cache';

    protected $fillable = [
        'station_id',
        'location_key',
        'temperature_c',
        'feels_like_c',
        'humidity_pct',
        'rainfall_mm',
        'wind_speed_kmh',
        'wind_direction',
        'condition',
        'uv_index',
        'air_quality_index',
        'sunrise_at',
        'sunset_at',
        'observed_at',
    ];

    protected $casts = [
        'temperature_c' => 'decimal:1',
        'feels_like_c' => 'decimal:1',
        'humidity_pct' => 'integer',
        'rainfall_mm' => 'decimal:2',
        'wind_speed_kmh' => 'decimal:2',
        'uv_index' => 'integer',
        'air_quality_index' => 'integer',
        'sunrise_at' => 'datetime',
        'sunset_at' => 'datetime',
        'observed_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<WeatherStation, $this>
     */
    public function station(): BelongsTo
    {
        return $this->belongsTo(WeatherStation::class, 'station_id');
    }
}
