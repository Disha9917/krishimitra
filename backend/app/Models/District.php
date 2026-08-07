<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class District extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'region_id',
        'code',
        'name',
        'name_gujarati',
        'default_pincode',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * @return BelongsTo<Region, $this>
     */
    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class, 'region_id');
    }

    /**
     * @return HasMany<Taluka, $this>
     */
    public function talukas(): HasMany
    {
        return $this->hasMany(Taluka::class, 'district_id');
    }

    /**
     * @return HasMany<WeatherStation, $this>
     */
    public function weatherStations(): HasMany
    {
        return $this->hasMany(WeatherStation::class, 'district_id');
    }

    /**
     * @return HasMany<Mandi, $this>
     */
    public function mandis(): HasMany
    {
        return $this->hasMany(Mandi::class, 'district_id');
    }

    /**
     * @return HasMany<FarmerProfile, $this>
     */
    public function farmerProfiles(): HasMany
    {
        return $this->hasMany(FarmerProfile::class, 'district_id');
    }

    /**
     * @return HasMany<AiAdvisory, $this>
     */
    public function aiAdvisories(): HasMany
    {
        return $this->hasMany(AiAdvisory::class, 'district_id');
    }

    /**
     * @return HasMany<WeatherAlert, $this>
     */
    public function weatherAlerts(): HasMany
    {
        return $this->hasMany(WeatherAlert::class, 'district_id');
    }

    /**
     * @return HasMany<Equipment, $this>
     */
    public function equipmentListings(): HasMany
    {
        return $this->hasMany(Equipment::class, 'district_id');
    }

    /**
     * @return HasMany<ColdStorage, $this>
     */
    public function coldStorages(): HasMany
    {
        return $this->hasMany(ColdStorage::class, 'district_id');
    }

    /**
     * @return HasMany<DistrictCropMap, $this>
     */
    public function districtCropMaps(): HasMany
    {
        return $this->hasMany(DistrictCropMap::class, 'district_id');
    }
}
