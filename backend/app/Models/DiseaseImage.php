<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiseaseImage extends Model
{
    use HasFactory;

    /**
     * Append-only table: only `created_at` exists (DB default `now()`).
     *
     * @var bool
     */
    public $timestamps = false;

    protected $fillable = [
        'detection_id',
        'file_id',
        'is_primary',
        'width',
        'height',
        'size_bytes',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'width' => 'integer',
        'height' => 'integer',
        'size_bytes' => 'integer',
        'created_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<DiseaseDetection, $this>
     */
    public function detection(): BelongsTo
    {
        return $this->belongsTo(DiseaseDetection::class, 'detection_id');
    }

    /**
     * @return BelongsTo<UploadedFile, $this>
     */
    public function file(): BelongsTo
    {
        return $this->belongsTo(UploadedFile::class, 'file_id');
    }
}
