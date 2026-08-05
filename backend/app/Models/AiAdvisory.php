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
        'farmer_crop_id',
        'crop_id',
        'district_id',
        'pincode',
        'input_snapshot',
        'top3_advisories',
        'irrigation_plan',
        'fertilizer_plan',
        'pest_alert',
        'timeline_7_days',
        'generated_at',
        'model_version',
    ];

    protected $casts = [
        'input_snapshot' => 'array',
        'top3_advisories' => 'array',
        'irrigation_plan' => 'array',
        'fertilizer_plan' => 'array',
        'pest_alert' => 'array',
        'timeline_7_days' => 'array',
        'generated_at' => 'datetime',
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
