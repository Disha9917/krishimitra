<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class DiseaseHistory extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'disease_history';

    protected $fillable = [
        'detection_id',
        'user_id',
        'field_id',
        'crop_id',
        'disease_id',
        'resolved',
        'treatment_applied',
        'outcome_notes',
        'recurrence_count',
    ];

    protected $casts = [
        'resolved' => 'boolean',
        'recurrence_count' => 'integer',
    ];

    /**
     * @return BelongsTo<DiseaseDetection, $this>
     */
    public function detection(): BelongsTo
    {
        return $this->belongsTo(DiseaseDetection::class, 'detection_id');
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
}
