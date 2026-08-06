<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TemperatureTrendResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'locationKey' => $this['locationKey'],
            'source' => $this['source'],
            'days' => $this['days'],
            'avgMaxC' => $this['avgMaxC'],
            'avgMinC' => $this['avgMinC'],
            'deltaMaxC' => $this['deltaMaxC'],
            'direction' => $this['direction'],
        ];
    }
}
