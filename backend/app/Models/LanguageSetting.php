<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LanguageSetting extends Model
{
    use HasFactory;

    /**
     * Append-only table: only `created_at` exists (DB default `now()`).
     *
     * @var bool
     */
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'language',
        'changed_at',
    ];

    protected $casts = [
        'changed_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
