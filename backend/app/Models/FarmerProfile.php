<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FarmerProfile extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'farm_size_acres',
        'primary_crop_id',
        'pincode',
        'state',
        'district_id',
        'taluka_id',
        'village',
        'alert_preferences',
    ];

    protected $casts = [
        'farm_size_acres' => 'decimal:2',
        'alert_preferences' => 'array',
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
    public function primaryCrop(): BelongsTo
    {
        return $this->belongsTo(Crop::class, 'primary_crop_id');
    }

    /**
     * @return BelongsTo<District, $this>
     */
    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class, 'district_id');
    }

    /**
     * @return BelongsTo<Taluka, $this>
     */
    public function taluka(): BelongsTo
    {
        return $this->belongsTo(Taluka::class, 'taluka_id');
    }
}
