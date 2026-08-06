<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WeatherForecast extends Model
{
    use HasFactory;

    protected $fillable = [
        'location_key',
        'station_id',
        'forecast_date',
        'day',
        'temp_max_c',
        'temp_min_c',
        'condition',
        'rainfall_probability_pct',
        'humidity_pct',
        'wind_speed_kmh',
        'sunrise_at',
        'sunset_at',
        'irrigation_needed',
        'disease_risk',
        'provider',
    ];

    protected $casts = [
        'forecast_date' => 'date',
        'temp_max_c' => 'decimal:1',
        'temp_min_c' => 'decimal:1',
        'rainfall_probability_pct' => 'integer',
        'humidity_pct' => 'integer',
        'wind_speed_kmh' => 'decimal:2',
        'sunrise_at' => 'datetime',
        'sunset_at' => 'datetime',
        'irrigation_needed' => 'boolean',
    ];

    /**
     * @return BelongsTo<WeatherStation, $this>
     */
    public function station(): BelongsTo
    {
        return $this->belongsTo(WeatherStation::class, 'station_id');
    }
}
