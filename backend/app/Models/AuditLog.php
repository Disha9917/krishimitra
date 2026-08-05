<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    use HasFactory;

    /**
     * Append-only, non-deletable table: only `created_at` exists (DB default `now()`).
     *
     * @var bool
     */
    public $timestamps = false;

    protected $fillable = [
        'actor_user_id',
        'actor_role_code',
        'action',
        'entity_type',
        'entity_id',
        'old_values_json',
        'new_values_json',
        'ip_address',
        'user_agent',
        'performed_at',
    ];

    protected $casts = [
        'entity_id' => 'integer',
        'old_values_json' => 'array',
        'new_values_json' => 'array',
        'performed_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_user_id');
    }
}
