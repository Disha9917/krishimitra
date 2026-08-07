<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExportHistory extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'export_history';

    /**
     * Append-only table: only `created_at` exists (DB default `now()`).
     *
     * @var bool
     */
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'report_id',
        'export_type',
        'format',
        'row_count',
        'ip_address',
        'exported_at',
    ];

    protected $casts = [
        'row_count' => 'integer',
        'exported_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<Report, $this>
     */
    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class, 'report_id');
    }
}
