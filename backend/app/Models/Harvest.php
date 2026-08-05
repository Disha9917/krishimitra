<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Harvest extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'farmer_crop_id',
        'crop_id',
        'harvest_date',
        'quantity_kg',
        'yield_per_acre',
        'moisture_pct',
        'quality_grade',
    ];

    protected $casts = [
        'harvest_date' => 'date',
        'quantity_kg' => 'decimal:2',
        'yield_per_acre' => 'decimal:2',
        'moisture_pct' => 'decimal:2',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<FarmerCrop, $this>
     */
    public function farmerCrop(): BelongsTo
    {
        return $this->belongsTo(FarmerCrop::class, 'farmer_crop_id');
    }

    /**
     * @return BelongsTo<Crop, $this>
     */
    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class, 'crop_id');
    }
}
