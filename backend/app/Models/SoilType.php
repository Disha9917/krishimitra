<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SoilType extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'water_retention_desc',
    ];

    /**
     * @return HasMany<FarmerField, $this>
     */
    public function farmerFields(): HasMany
    {
        return $this->hasMany(FarmerField::class, 'soil_type_id');
    }
}
