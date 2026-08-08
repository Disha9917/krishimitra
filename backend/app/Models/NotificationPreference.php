<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class NotificationPreference extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'notification_preferences';

    protected $fillable = [
        'user_id',
        'weather_alerts',
        'disease_alerts',
        'market_alerts',
        'government_scheme_alerts',
        'equipment_alerts',
        'cold_storage_alerts',
        'transport_alerts',
        'ai_advisory_alerts',
        'system_alerts',
        'email_enabled',
    ];

    protected $casts = [
        'weather_alerts' => 'boolean',
        'disease_alerts' => 'boolean',
        'market_alerts' => 'boolean',
        'government_scheme_alerts' => 'boolean',
        'equipment_alerts' => 'boolean',
        'cold_storage_alerts' => 'boolean',
        'transport_alerts' => 'boolean',
        'ai_advisory_alerts' => 'boolean',
        'system_alerts' => 'boolean',
        'email_enabled' => 'boolean',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
