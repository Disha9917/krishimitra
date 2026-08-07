<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\OtpCode;
use App\Repositories\Contracts\OtpCodeRepositoryInterface;

class EloquentOtpCodeRepository extends BaseEloquentRepository implements OtpCodeRepositoryInterface
{
    public function __construct(OtpCode $model)
    {
        parent::__construct($model);
    }

    public function findPendingByDestination(string $destination, string $purpose): ?OtpCode
    {
            return $this->model
                ->where('destination', $destination)
                ->where('purpose', $purpose)
                ->whereNull('consumed_at')
                ->where('expires_at', '>', now())
                ->orderByDesc('id')
                ->first();
    }
}
