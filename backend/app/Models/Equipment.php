<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Equipment extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'equipment_listings';

    protected $fillable = [
        'uuid',
        'provider_id',
        'name',
        'equipment_type',
        'description',
        'hourly_rate',
        'daily_rate',
        'pincode',
        'district_id',
        'lat',
        'lng',
        'is_available',
        'image_file_id',
        'rating_avg',
    ];

    protected $casts = [
        'hourly_rate' => 'decimal:2',
        'daily_rate' => 'decimal:2',
        'lat' => 'decimal:6',
        'lng' => 'decimal:6',
        'is_available' => 'boolean',
        'rating_avg' => 'decimal:2',
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
    public function provider(): BelongsTo
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    /**
     * @return BelongsTo<District, $this>
     */
    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class, 'district_id');
    }

    /**
     * @return BelongsTo<UploadedFile, $this>
     */
    public function imageFile(): BelongsTo
    {
        return $this->belongsTo(UploadedFile::class, 'image_file_id');
    }

    /**
     * @return HasMany<EquipmentBooking, $this>
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(EquipmentBooking::class, 'equipment_id');
    }
}
