<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Village extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'taluka_id',
        'code',
        'name',
        'pincode',
        'lat',
        'lng',
    ];

    protected $casts = [
        'lat' => 'decimal:6',
        'lng' => 'decimal:6',
    ];

    /**
     * @return BelongsTo<Taluka, $this>
     */
    public function taluka(): BelongsTo
    {
        return $this->belongsTo(Taluka::class, 'taluka_id');
    }
}
