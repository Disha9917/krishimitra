<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AiAdvisory extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'advisory_type',
        'topic',
        'farmer_crop_id',
        'crop_id',
        'district_id',
        'pincode',
        'input_snapshot',
        'context_snapshot',
        'top3_advisories',
        'irrigation_plan',
        'fertilizer_plan',
        'pest_alert',
        'timeline_7_days',
        'generated_at',
        'model_version',
        'provider',
        'risk_level',
        'confidence',
        'is_favorite',
        'rating',
        'helpful',
        'feedback_comment',
        'feedback_at',
        'prompt_text',
        'response_content',
        'usage',
        'latency_ms',
    ];

    protected $casts = [
        'input_snapshot' => 'array',
        'context_snapshot' => 'array',
        'top3_advisories' => 'array',
        'irrigation_plan' => 'array',
        'fertilizer_plan' => 'array',
        'pest_alert' => 'array',
        'timeline_7_days' => 'array',
        'usage' => 'array',
        'confidence' => 'float',
        'is_favorite' => 'boolean',
        'rating' => 'integer',
        'helpful' => 'boolean',
        'generated_at' => 'datetime',
        'feedback_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<FarmerCrop, $this>
     */
    public function farmerCrop(): BelongsTo
    {
        return $this->belongsTo(FarmerCrop::class, 'farmer_crop_id');
    }

    /**
     * @return BelongsTo<Crop, $this>
     */
    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class, 'crop_id');
    }

    /**
     * @return BelongsTo<District, $this>
     */
    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class, 'district_id');
    }
}
