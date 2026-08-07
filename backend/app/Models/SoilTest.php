<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SoilTest extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'field_id',
        'lab_name',
        'report_date',
        'ph',
        'ec',
        'nitrogen_kg_ha',
        'phosphorus_kg_ha',
        'potassium_kg_ha',
        'organic_carbon_pct',
        'report_file_id',
    ];

    protected $casts = [
        'report_date' => 'date',
        'ph' => 'decimal:2',
        'ec' => 'decimal:3',
        'nitrogen_kg_ha' => 'decimal:2',
        'phosphorus_kg_ha' => 'decimal:2',
        'potassium_kg_ha' => 'decimal:2',
        'organic_carbon_pct' => 'decimal:2',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<FarmerField, $this>
     */
    public function field(): BelongsTo
    {
        return $this->belongsTo(FarmerField::class, 'field_id');
    }

    /**
     * @return BelongsTo<UploadedFile, $this>
     */
    public function reportFile(): BelongsTo
    {
        return $this->belongsTo(UploadedFile::class, 'report_file_id');
    }

    /**
     * @return HasMany<SoilHistory, $this>
     */
    public function soilHistories(): HasMany
    {
        return $this->hasMany(SoilHistory::class, 'soil_test_id');
    }
}
