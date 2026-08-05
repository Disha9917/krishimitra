<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransportRoute extends Model
{
    use HasFactory;

    protected $fillable = [
        'origin_key',
        'destination_key',
        'distance_km',
        'duration_hours',
        'route_geometry',
        'provider',
        'expires_at',
    ];

    protected $casts = [
        'distance_km' => 'decimal:2',
        'duration_hours' => 'decimal:2',
        'route_geometry' => 'array',
        'expires_at' => 'datetime',
    ];
}
