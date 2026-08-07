<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DashboardAnalytic extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'snapshot_date',
        'weather_temp_c',
        'current_crop_id',
        'advisories_count',
        'disease_risk',
        'market_price_wheat',
        'unread_notifications_count',
        'analytics_json',
    ];

    protected $casts = [
        'snapshot_date' => 'date',
        'weather_temp_c' => 'decimal:1',
        'advisories_count' => 'integer',
        'market_price_wheat' => 'decimal:2',
        'unread_notifications_count' => 'integer',
        'analytics_json' => 'array',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<Crop, $this>
     */
    public function currentCrop(): BelongsTo
    {
        return $this->belongsTo(Crop::class, 'current_crop_id');
    }
}
