<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class NotificationSetting extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'sms_enabled',
        'whatsapp_enabled',
        'price_threshold_alerts',
        'disease_alerts',
        'weather_alerts',
        'min_price_threshold_inr',
    ];

    protected $casts = [
        'sms_enabled' => 'boolean',
        'whatsapp_enabled' => 'boolean',
        'price_threshold_alerts' => 'boolean',
        'disease_alerts' => 'boolean',
        'weather_alerts' => 'boolean',
        'min_price_threshold_inr' => 'decimal:2',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
