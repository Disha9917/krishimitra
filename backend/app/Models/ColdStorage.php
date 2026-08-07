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
        'pincode',
        'district_id',
        'lat',
        'lng',
        'capacity_tonnes',
        'occupied_tonnes',
        'temp_range_c',
        'rate_per_tonne_month',
        'is_active',
    ];

    protected $casts = [
        'lat' => 'decimal:6',
        'lng' => 'decimal:6',
        'capacity_tonnes' => 'decimal:2',
        'occupied_tonnes' => 'decimal:2',
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
     * @return HasMany<ColdStorageBooking, $this>
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(ColdStorageBooking::class, 'cold_storage_id');
    }
}
