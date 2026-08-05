<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class UploadedFile extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'user_id',
        'disk',
        'path',
        'original_name',
        'mime_type',
        'size_bytes',
        'sha256_hash',
        'visibility',
    ];

    protected $casts = [
        'size_bytes' => 'integer',
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
     * @return HasMany<FarmerDocument, $this>
     */
    public function farmerDocuments(): HasMany
    {
        return $this->hasMany(FarmerDocument::class, 'file_id');
    }

    /**
     * @return HasMany<SoilTest, $this>
     */
    public function soilTests(): HasMany
    {
        return $this->hasMany(SoilTest::class, 'report_file_id');
    }

    /**
     * @return HasMany<DiseaseImage, $this>
     */
    public function diseaseImages(): HasMany
    {
        return $this->hasMany(DiseaseImage::class, 'file_id');
    }

    /**
     * @return HasMany<Equipment, $this>
     */
    public function equipmentListings(): HasMany
    {
        return $this->hasMany(Equipment::class, 'image_file_id');
    }
}
