<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImportLog extends Model
{
    protected $fillable = [
        'import_id',
        'row_number',
        'action',
        'entity_id',
        'entity_key',
        'message',
        'before_data',
    ];

    protected $casts = [
        'row_number' => 'integer',
        'entity_id' => 'integer',
        'before_data' => 'array',
    ];

    /**
     * @return BelongsTo<ImportHistory, $this>
     */
    public function history(): BelongsTo
    {
        return $this->belongsTo(ImportHistory::class, 'import_id');
    }
}
