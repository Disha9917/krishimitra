<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\UploadedFile;
use Illuminate\Database\Eloquent\Collection;

interface UploadedFileRepositoryInterface extends BaseRepositoryInterface
{

    public function filesForUser(int $userId): Collection;
}
