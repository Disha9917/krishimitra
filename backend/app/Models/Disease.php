<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Disease extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'crop_id',
        'code',
        'name',
        'scientific_name',
        'severity_default',
        'symptoms',
        'preventive_measures',
        'chemical_treatments',
        'organic_treatments',
        'recommended_product',
        'dosage',
        'image_url',
    ];

    protected $casts = [
        'symptoms' => 'array',
        'preventive_measures' => 'array',
        'chemical_treatments' => 'array',
        'organic_treatments' => 'array',
    ];

    /**
     * @return BelongsTo<Crop, $this>
     */
    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class, 'crop_id');
    }

    /**
     * @return HasMany<DiseaseDetection, $this>
     */
    public function diseaseDetections(): HasMany
    {
        return $this->hasMany(DiseaseDetection::class, 'disease_id');
    }

    /**
     * @return HasMany<DiseaseHistory, $this>
     */
    public function diseaseHistories(): HasMany
    {
        return $this->hasMany(DiseaseHistory::class, 'disease_id');
    }

    /**
     * @return HasMany<TreatmentRecommendation, $this>
     */
    public function treatmentRecommendations(): HasMany
    {
        return $this->hasMany(TreatmentRecommendation::class, 'disease_id');
    }

    /**
     * @return HasMany<PredictionHistory, $this>
     */
    public function predictionHistories(): HasMany
    {
        return $this->hasMany(PredictionHistory::class, 'disease_id');
    }
}
