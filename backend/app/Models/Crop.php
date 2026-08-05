<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Crop extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'name_gujarati',
        'category',
        'is_premium',
        'base_yield',
        'avg_price_per_qtl',
        'season',
        'sowing_period',
        'crop_icon_url',
        'is_active',
    ];

    protected $casts = [
        'is_premium' => 'boolean',
        'avg_price_per_qtl' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * @return HasMany<CropVariety, $this>
     */
    public function varieties(): HasMany
    {
        return $this->hasMany(CropVariety::class, 'crop_id');
    }

    /**
     * @return HasMany<CropCalendar, $this>
     */
    public function cropCalendars(): HasMany
    {
        return $this->hasMany(CropCalendar::class, 'crop_id');
    }

    /**
     * @return HasMany<FarmerCrop, $this>
     */
    public function farmerCrops(): HasMany
    {
        return $this->hasMany(FarmerCrop::class, 'crop_id');
    }

    /**
     * @return HasMany<FarmerProfile, $this>
     */
    public function farmerProfiles(): HasMany
    {
        return $this->hasMany(FarmerProfile::class, 'primary_crop_id');
    }

    /**
     * @return HasMany<FarmerField, $this>
     */
    public function farmerFields(): HasMany
    {
        return $this->hasMany(FarmerField::class, 'current_crop_id');
    }

    /**
     * @return HasMany<Harvest, $this>
     */
    public function harvests(): HasMany
    {
        return $this->hasMany(Harvest::class, 'crop_id');
    }

    /**
     * @return HasMany<CropRecommendation, $this>
     */
    public function cropRecommendations(): HasMany
    {
        return $this->hasMany(CropRecommendation::class, 'selected_crop_id');
    }

    /**
     * @return HasMany<AiAdvisory, $this>
     */
    public function aiAdvisories(): HasMany
    {
        return $this->hasMany(AiAdvisory::class, 'crop_id');
    }

    /**
     * @return HasMany<Disease, $this>
     */
    public function diseases(): HasMany
    {
        return $this->hasMany(Disease::class, 'crop_id');
    }

    /**
     * @return HasMany<DiseaseDetection, $this>
     */
    public function diseaseDetections(): HasMany
    {
        return $this->hasMany(DiseaseDetection::class, 'crop_id');
    }

    /**
     * @return HasMany<DiseaseHistory, $this>
     */
    public function diseaseHistories(): HasMany
    {
        return $this->hasMany(DiseaseHistory::class, 'crop_id');
    }

    /**
     * @return HasMany<TreatmentRecommendation, $this>
     */
    public function treatmentRecommendations(): HasMany
    {
        return $this->hasMany(TreatmentRecommendation::class, 'crop_id');
    }

    /**
     * @return HasMany<MarketPrice, $this>
     */
    public function marketPrices(): HasMany
    {
        return $this->hasMany(MarketPrice::class, 'crop_id');
    }

    /**
     * @return HasMany<PricePrediction, $this>
     */
    public function pricePredictions(): HasMany
    {
        return $this->hasMany(PricePrediction::class, 'crop_id');
    }

    /**
     * @return HasMany<ColdStorageBooking, $this>
     */
    public function storageBookings(): HasMany
    {
        return $this->hasMany(ColdStorageBooking::class, 'crop_id');
    }

    /**
     * @return HasMany<PostHarvestAnalysis, $this>
     */
    public function postHarvestAnalyses(): HasMany
    {
        return $this->hasMany(PostHarvestAnalysis::class, 'crop_id');
    }

    /**
     * @return HasMany<DashboardAnalytic, $this>
     */
    public function dashboardAnalytics(): HasMany
    {
        return $this->hasMany(DashboardAnalytic::class, 'current_crop_id');
    }

    /**
     * @return HasMany<DistrictCropMap, $this>
     */
    public function districtCropMaps(): HasMany
    {
        return $this->hasMany(DistrictCropMap::class, 'crop_id');
    }

    /**
     * @return HasMany<PredictionHistory, $this>
     */
    public function predictionHistories(): HasMany
    {
        return $this->hasMany(PredictionHistory::class, 'crop_id');
    }
}
