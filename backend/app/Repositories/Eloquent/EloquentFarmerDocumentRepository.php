<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\FarmerDocument;
use App\Repositories\Contracts\FarmerDocumentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentFarmerDocumentRepository extends BaseEloquentRepository implements FarmerDocumentRepositoryInterface
{
    public function __construct(FarmerDocument $model)
    {
        parent::__construct($model);
    }

    public function documentsForUser(int $userId): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->orderByDesc('id')
                ->get();
    }
}
