<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CropCalendar extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'crop_calendar';

    protected $fillable = [
        'crop_id',
        'stage',
        'day_start',
        'day_end',
        'activity',
        'fertilizer_json',
        'irrigation_json',
    ];

    protected $casts = [
        'day_start' => 'integer',
        'day_end' => 'integer',
        'fertilizer_json' => 'array',
        'irrigation_json' => 'array',
    ];

    /**
     * @return BelongsTo<Crop, $this>
     */
    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class, 'crop_id');
    }
}
