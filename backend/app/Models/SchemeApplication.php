<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SchemeApplication extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'user_id',
        'scheme_id',
        'status',
        'submitted_at',
        'documents_json',
        'remarks',
        'reviewed_by',
        'decided_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'documents_json' => 'array',
        'decided_at' => 'datetime',
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
     * @return BelongsTo<GovernmentScheme, $this>
     */
    public function scheme(): BelongsTo
    {
        return $this->belongsTo(GovernmentScheme::class, 'scheme_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
