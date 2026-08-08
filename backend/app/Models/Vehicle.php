<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'vehicles';

    protected $fillable = [
        'uuid',
        'owner_id',
        'vehicle_type_id',
        'name',
        'vehicle_number',
        'capacity_kg',
        'price_per_km',
        'loading_charges',
        'driver_name',
        'driver_phone',
        'contact_phone',
        'pincode',
        'district_id',
        'taluka_id',
        'village_id',
        'lat',
        'lng',
        'service_areas',
        'is_available',
        'is_active',
        'image_file_id',
        'images_json',
        'rating_avg',
    ];

    protected $casts = [
        'capacity_kg' => 'decimal:2',
        'price_per_km' => 'decimal:2',
        'loading_charges' => 'decimal:2',
        'lat' => 'decimal:6',
        'lng' => 'decimal:6',
        'service_areas' => 'array',
        'is_available' => 'boolean',
        'is_active' => 'boolean',
        'images_json' => 'array',
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
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * @return BelongsTo<TransportVehicleType, $this>
     */
    public function vehicleType(): BelongsTo
    {
        return $this->belongsTo(TransportVehicleType::class, 'vehicle_type_id');
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
     * @return HasMany<TransportBooking, $this>
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(TransportBooking::class, 'vehicle_id');
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
}
