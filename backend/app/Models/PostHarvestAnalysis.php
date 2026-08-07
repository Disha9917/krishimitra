<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PostHarvestAnalysis extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'user_id',
        'crop_id',
        'quantity_kg',
        'harvest_date',
        'storage_condition',
        'location',
        'spoilage_risk_pct',
        'risk_level',
        'shelf_life_days',
        'days_remaining',
        'storage_recommendation',
        'decisions_json',
        'analyzed_at',
        'model_version',
    ];

    protected $casts = [
        'quantity_kg' => 'decimal:2',
        'harvest_date' => 'date',
        'spoilage_risk_pct' => 'decimal:2',
        'shelf_life_days' => 'integer',
        'days_remaining' => 'integer',
        'decisions_json' => 'array',
        'analyzed_at' => 'datetime',
    ];

    /**
     * The columns that should receive a UUID (the primary key stays BIGINT).
     *
     * @return list<string>
     */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

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
    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class, 'crop_id');
    }
}
