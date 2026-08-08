<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'user_id',
        'title',
        'category',
        'report_type',
        'status',
        'formats',
        'filters',
        'data',
        'files',
        'is_favorite',
        'file_format',
        'file_size_bytes',
        'file_size_display',
        'summary_text',
        'storage_path',
        'source_ref',
        'error_message',
        'generated_at',
    ];

    protected $casts = [
        'file_size_bytes' => 'integer',
        'generated_at' => 'datetime',
        'formats' => 'array',
        'filters' => 'array',
        'data' => 'array',
        'files' => 'array',
        'is_favorite' => 'boolean',
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
     * @return HasMany<ExportHistory, $this>
     */
    public function exportHistory(): HasMany
    {
        return $this->hasMany(ExportHistory::class, 'report_id');
    }

    /**
     * @return HasMany<PredictionHistory, $this>
     */
    public function predictionHistories(): HasMany
    {
        return $this->hasMany(PredictionHistory::class, 'report_id');
    }
}
