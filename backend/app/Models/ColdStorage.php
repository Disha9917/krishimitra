<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ColdStorage extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'owner_id',
        'name',
        'description',
        'contact_phone',
        'pincode',
        'district_id',
        'taluka_id',
        'village_id',
        'lat',
        'lng',
        'capacity_tonnes',
        'occupied_tonnes',
        'temp_range_c',
        'min_temp_c',
        'max_temp_c',
        'humidity_range',
        'supported_crops',
        'image_file_id',
        'images_json',
        'rate_per_tonne_month',
        'is_active',
    ];

    protected $casts = [
        'lat' => 'decimal:6',
        'lng' => 'decimal:6',
        'capacity_tonnes' => 'decimal:2',
        'occupied_tonnes' => 'decimal:2',
        'min_temp_c' => 'decimal:2',
        'max_temp_c' => 'decimal:2',
        'supported_crops' => 'array',
        'images_json' => 'array',
        'rate_per_tonne_month' => 'decimal:2',
        'is_active' => 'boolean',
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
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
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

    /**
     * @return BelongsTo<Village, $this>
     */
    public function village(): BelongsTo
    {
        return $this->belongsTo(Village::class, 'village_id');
    }

    /**
     * @return BelongsTo<UploadedFile, $this>
     */
    public function imageFile(): BelongsTo
    {
        return $this->belongsTo(UploadedFile::class, 'image_file_id');
    }

    /**
     * Resolve the uploaded files referenced by the images_json column.
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, UploadedFile>
     */
    public function imageFiles(): \Illuminate\Database\Eloquent\Collection
    {
        $ids = array_values(array_unique(array_map('intval', (array) ($this->images_json ?? []))));

        return UploadedFile::whereIn('id', $ids)->get();
    }

    /**
     * Remaining capacity in tonnes after reserved bookings.
     */
    public function availableCapacity(): float
    {
        return max(0.0, (float) $this->capacity_tonnes - (float) $this->occupied_tonnes);
    }

    /**
     * @return HasMany<ColdStorageBooking, $this>
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(ColdStorageBooking::class, 'cold_storage_id');
    }
}
