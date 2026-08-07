<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class FarmerCrop extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'crop_id',
        'field_id',
        'season',
        'sowing_date',
        'expected_harvest_date',
        'is_current',
    ];

    protected $casts = [
        'sowing_date' => 'date',
        'expected_harvest_date' => 'date',
        'is_current' => 'boolean',
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
    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class, 'crop_id');
    }

    /**
     * @return BelongsTo<FarmerField, $this>
     */
    public function field(): BelongsTo
    {
        return $this->belongsTo(FarmerField::class, 'field_id');
    }

    /**
     * @return HasMany<Harvest, $this>
     */
    public function harvests(): HasMany
    {
        return $this->hasMany(Harvest::class, 'farmer_crop_id');
    }

    /**
     * @return HasMany<AiAdvisory, $this>
     */
    public function aiAdvisories(): HasMany
    {
        return $this->hasMany(AiAdvisory::class, 'farmer_crop_id');
    }
}
