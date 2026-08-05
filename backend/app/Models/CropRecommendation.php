<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CropRecommendation extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'input_snapshot',
        'recommendations',
        'selected_crop_id',
        'generated_at',
        'model_version',
    ];

    protected $casts = [
        'input_snapshot' => 'array',
        'recommendations' => 'array',
        'generated_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<Crop, $this>
     */
    public function selectedCrop(): BelongsTo
    {
        return $this->belongsTo(Crop::class, 'selected_crop_id');
    }
}
