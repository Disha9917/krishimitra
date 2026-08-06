<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\UploadedFile;
use App\Repositories\Contracts\UploadedFileRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentUploadedFileRepository extends BaseEloquentRepository implements UploadedFileRepositoryInterface
{
    public function __construct(UploadedFile $model)
    {
        parent::__construct($model);
    }

    public function filesForUser(int $userId): Collection
    {
            return $this->model
                ->where('user_id', $userId)
                ->orderByDesc('id')
                ->get();
    }
}
