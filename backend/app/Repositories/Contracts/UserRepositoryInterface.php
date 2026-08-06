<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\User;

interface UserRepositoryInterface extends BaseRepositoryInterface
{

    public function findByPhone(string $phone): ?User;

    public function findByEmail(string $email): ?User;

    /**
     * Resolve a user by either phone or email.
     */
    public function findByIdentifier(string $identifier): ?User;
}
