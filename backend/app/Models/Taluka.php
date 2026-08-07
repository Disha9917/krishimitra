<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Taluka extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'district_id',
        'code',
        'name',
        'name_gujarati',
        'default_pincode',
    ];

    /**
     * @return BelongsTo<District, $this>
     */
    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class, 'district_id');
    }

    /**
     * @return HasMany<Village, $this>
     */
    public function villages(): HasMany
    {
        return $this->hasMany(Village::class, 'taluka_id');
    }

    /**
     * @return HasMany<FarmerProfile, $this>
     */
    public function farmerProfiles(): HasMany
    {
        return $this->hasMany(FarmerProfile::class, 'taluka_id');
    }
}
