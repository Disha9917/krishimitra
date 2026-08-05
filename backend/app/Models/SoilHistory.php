<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SoilHistory extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'soil_history';

    protected $fillable = [
        'field_id',
        'soil_test_id',
        'sampled_on',
        'parameters_json',
    ];

    protected $casts = [
        'sampled_on' => 'date',
        'parameters_json' => 'array',
    ];

    /**
     * @return BelongsTo<FarmerField, $this>
     */
    public function field(): BelongsTo
    {
        return $this->belongsTo(FarmerField::class, 'field_id');
    }

    /**
     * @return BelongsTo<SoilTest, $this>
     */
    public function soilTest(): BelongsTo
    {
        return $this->belongsTo(SoilTest::class, 'soil_test_id');
    }
}
