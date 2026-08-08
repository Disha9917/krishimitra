<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PriceHistoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'cropId' => $this['crop_id'],
            'mandiId' => $this['mandi_id'],
            'period' => $this['period'],
            'from' => $this['from'],
            'to' => $this['to'],
            'points' => $this['points'],
            'pointsCount' => $this['points_count'],
        ];
    }
}
