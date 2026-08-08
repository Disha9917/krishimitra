<?php

declare(strict_types=1);

namespace App\Http\Resources\AI;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \ArrayAccess<int|string, mixed>
 */
class AIProviderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'key' => (string) ($this['key'] ?? ''),
            'label' => (string) ($this['label'] ?? ''),
            'model' => (string) ($this['model'] ?? ''),
            'active' => (bool) ($this['active'] ?? false),
        ];
    }
}
