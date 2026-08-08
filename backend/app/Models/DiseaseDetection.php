<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DiseaseDetection extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'user_id',
        'field_id',
        'crop_id',
        'disease_id',
        'disease_name',
        'scientific_name',
        'description',
        'symptoms',
        'confidence',
        'confidence_score',
        'severity',
        'detection_source',
        'detection_status',
        'treatment_snapshot',
        'detected_at',
        'model_version',
    ];

    protected $casts = [
        'confidence_score' => 'decimal:2',
        'symptoms' => 'array',
        'treatment_snapshot' => 'array',
        'detected_at' => 'datetime',
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
     * @return BelongsTo<FarmerField, $this>
     */
    public function field(): BelongsTo
    {
        return $this->belongsTo(FarmerField::class, 'field_id');
    }

    /**
     * @return BelongsTo<Crop, $this>
     */
    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class, 'crop_id');
    }

    /**
     * @return BelongsTo<Disease, $this>
     */
    public function disease(): BelongsTo
    {
        return $this->belongsTo(Disease::class, 'disease_id');
    }

    /**
     * @return HasMany<DiseaseImage, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(DiseaseImage::class, 'detection_id');
    }

    /**
     * @return HasMany<DiseaseHistory, $this>
     */
    public function diseaseHistories(): HasMany
    {
        return $this->hasMany(DiseaseHistory::class, 'detection_id');
    }
}
