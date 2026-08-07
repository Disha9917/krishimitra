<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UvIndexResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'locationKey' => $this['locationKey'],
            'currentUvIndex' => $this['currentUvIndex'],
            'category' => $this['category'],
            'peakUvIndex' => $this['peakUvIndex'],
            'peakTime' => $this['peakTime'],
            'advisory' => $this['advisory'],
        ];
    }
}
