<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\FarmerDocument;
use Illuminate\Database\Eloquent\Collection;

interface FarmerDocumentRepositoryInterface extends BaseRepositoryInterface
{

    public function documentsForUser(int $userId): Collection;
}
