<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MarketPrice extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'mandi_id',
        'crop_id',
        'price_date',
        'min_price',
        'max_price',
        'todays_price',
        'change_pct',
        'trend',
        'unit',
        'source',
        'ingested_at',
    ];

    protected $casts = [
        'price_date' => 'date',
        'min_price' => 'decimal:2',
        'max_price' => 'decimal:2',
        'todays_price' => 'decimal:2',
        'change_pct' => 'decimal:2',
        'ingested_at' => 'datetime',
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
