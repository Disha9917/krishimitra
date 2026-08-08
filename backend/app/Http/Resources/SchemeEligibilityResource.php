<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin array{scheme_id: int, verdict: string, reasons: list<string>, criteria: array<string, array{status: string, reason: string}>}
 */
class SchemeEligibilityResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'schemeId' => (int) $this['scheme_id'],
            'verdict' => $this['verdict'],
            'reasons' => $this['reasons'],
            'criteria' => $this['criteria'],
        ];
    }
}
