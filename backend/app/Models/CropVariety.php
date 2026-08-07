<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CropVariety extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'crop_id',
        'name',
        'is_disease_resistant',
        'avg_duration_days',
    ];

    protected $casts = [
        'is_disease_resistant' => 'boolean',
        'avg_duration_days' => 'integer',
    ];

    /**
     * @return BelongsTo<Crop, $this>
     */
    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class, 'crop_id');
    }
}
