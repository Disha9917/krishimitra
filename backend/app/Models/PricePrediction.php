<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PricePrediction extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'mandi_id',
        'crop_id',
        'period',
        'predicted_prices',
        'model_version',
        'generated_at',
        'valid_until',
    ];

    protected $casts = [
        'period' => 'integer',
        'predicted_prices' => 'array',
        'generated_at' => 'datetime',
        'valid_until' => 'datetime',
    ];

    /**
     * @return BelongsTo<Mandi, $this>
     */
    public function mandi(): BelongsTo
    {
        return $this->belongsTo(Mandi::class, 'mandi_id');
    }

    /**
     * @return BelongsTo<Crop, $this>
     */
    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class, 'crop_id');
    }
}
