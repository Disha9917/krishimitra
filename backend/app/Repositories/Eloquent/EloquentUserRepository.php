<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;

class EloquentUserRepository extends BaseEloquentRepository implements UserRepositoryInterface
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function findByPhone(string $phone): ?User
    {
            return $this->model->where('phone', $phone)->first();
    }

    public function findByEmail(string $email): ?User
    {
            return $this->model->where('email', $email)->first();
    }

    public function findByIdentifier(string $identifier): ?User
    {
        return $this->model->where('phone', $identifier)
            ->orWhere('email', $identifier)
            ->first();
    }
}
