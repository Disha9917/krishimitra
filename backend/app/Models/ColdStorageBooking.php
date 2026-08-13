<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ColdStorageBooking extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'storage_bookings';

    protected $fillable = [
        'uuid',
        'user_id',
        'cold_storage_id',
        'crop_id',
        'quantity_kg',
        'start_date',
        'end_date',
        'total_amount',
        'status',
        'payment_status',
        'payment_method',
        'transaction_reference',
        'reason',
        'decided_at',
        'completed_at',
    ];

    protected $casts = [
        'quantity_kg' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'total_amount' => 'decimal:2',
        'decided_at' => 'datetime',
        'completed_at' => 'datetime',
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
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<ColdStorage, $this>
     */
    public function coldStorage(): BelongsTo
    {
        return $this->belongsTo(ColdStorage::class, 'cold_storage_id');
    }

    /**
     * @return BelongsTo<Crop, $this>
     */
    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class, 'crop_id');
    }
}
