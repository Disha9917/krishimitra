<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WeatherHourlyForecast extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'weather_hourly_forecasts';

    protected $fillable = [
        'location_key',
        'station_id',
        'forecast_time',
        'temperature_c',
        'humidity_pct',
        'precipitation_probability_pct',
        'wind_speed_kmh',
        'uv_index',
        'condition',
        'provider',
    ];

    protected $casts = [
        'forecast_time' => 'datetime',
        'temperature_c' => 'decimal:1',
        'humidity_pct' => 'integer',
        'precipitation_probability_pct' => 'integer',
        'wind_speed_kmh' => 'decimal:2',
        'uv_index' => 'integer',
    ];

    /**
     * @return BelongsTo<WeatherStation, $this>
     */
    public function station(): BelongsTo
    {
        return $this->belongsTo(WeatherStation::class, 'station_id');
    }
}
