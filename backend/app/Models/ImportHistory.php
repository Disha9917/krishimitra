<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ImportHistory extends Model
{
    use HasUuids;
    use SoftDeletes;

    protected $table = 'import_history';

    protected $fillable = [
        'uuid',
        'dataset_type',
        'file_name',
        'file_path',
        'total_rows',
        'valid_rows',
        'duplicate_rows',
        'existing_rows',
        'error_rows',
        'imported_rows',
        'updated_rows',
        'skipped_rows',
        'failed_rows',
        'status',
        'error_message',
        'started_at',
        'finished_at',
        'duration_ms',
        'uploaded_by',
    ];

    protected $casts = [
        'total_rows' => 'integer',
        'valid_rows' => 'integer',
        'duplicate_rows' => 'integer',
        'existing_rows' => 'integer',
        'error_rows' => 'integer',
        'imported_rows' => 'integer',
        'updated_rows' => 'integer',
        'skipped_rows' => 'integer',
        'failed_rows' => 'integer',
        'duration_ms' => 'integer',
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
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
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * @return HasMany<ImportLog, $this>
     */
    public function logs(): HasMany
    {
        return $this->hasMany(ImportLog::class, 'import_id');
    }
}
