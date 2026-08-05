<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class GovernmentScheme extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'schemes';

    protected $fillable = [
        'code',
        'title',
        'category',
        'description',
        'benefits',
        'eligibility_criteria',
        'documents_required',
        'state',
        'deadline',
        'apply_url',
        'official_link',
        'is_active',
    ];

    protected $casts = [
        'benefits' => 'array',
        'eligibility_criteria' => 'array',
        'documents_required' => 'array',
        'deadline' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * @return HasMany<SchemeApplication, $this>
     */
    public function applications(): HasMany
    {
        return $this->hasMany(SchemeApplication::class, 'scheme_id');
    }
}
