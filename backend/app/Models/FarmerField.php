<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class FarmerField extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'size_acres',
        'soil_type_id',
        'current_crop_id',
        'lat',
        'lng',
    ];

    protected $casts = [
        'size_acres' => 'decimal:2',
        'lat' => 'decimal:6',
        'lng' => 'decimal:6',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<SoilType, $this>
     */
    public function soilType(): BelongsTo
    {
        return $this->belongsTo(SoilType::class, 'soil_type_id');
    }

    /**
     * @return BelongsTo<Crop, $this>
     */
    public function currentCrop(): BelongsTo
    {
        return $this->belongsTo(Crop::class, 'current_crop_id');
    }

    /**
     * @return HasMany<FarmerCrop, $this>
     */
    public function farmerCrops(): HasMany
    {
        return $this->hasMany(FarmerCrop::class, 'field_id');
    }

    /**
     * @return HasMany<SoilTest, $this>
     */
    public function soilTests(): HasMany
    {
        return $this->hasMany(SoilTest::class, 'field_id');
    }

    /**
     * @return HasMany<SoilHistory, $this>
     */
    public function soilHistories(): HasMany
    {
        return $this->hasMany(SoilHistory::class, 'field_id');
    }

    /**
     * @return HasMany<DiseaseHistory, $this>
     */
    public function diseaseHistories(): HasMany
    {
        return $this->hasMany(DiseaseHistory::class, 'field_id');
    }
}
