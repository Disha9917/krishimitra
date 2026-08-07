<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\OtpCode;

interface OtpCodeRepositoryInterface extends BaseRepositoryInterface
{

    public function findPendingByDestination(string $destination, string $purpose): ?OtpCode;
}
