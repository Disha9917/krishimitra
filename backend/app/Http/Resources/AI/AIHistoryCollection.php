<?php

declare(strict_types=1);

namespace App\Http\Resources\AI;

use Illuminate\Http\Resources\Json\ResourceCollection;

class AIHistoryCollection extends ResourceCollection
{
    /**
     * The resource that each item wraps. The collection stays flat so the
     * /v1/ai/history contract (data = [history items]) is preserved.
     */
    public $collects = AIHistoryResource::class;
}
