<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TreatmentRecommendation extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'disease_id',
        'crop_id',
        'severity',
        'chemical_treatments',
        'organic_treatments',
        'recommended_product',
        'dosage',
        'is_active',
    ];

    protected $casts = [
        'chemical_treatments' => 'array',
        'organic_treatments' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * @return BelongsTo<Disease, $this>
     */
    public function disease(): BelongsTo
    {
        return $this->belongsTo(Disease::class, 'disease_id');
    }

    /**
     * @return BelongsTo<Crop, $this>
     */
    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class, 'crop_id');
    }
}
