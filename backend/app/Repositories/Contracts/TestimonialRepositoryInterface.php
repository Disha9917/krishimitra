<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Collection;

interface TestimonialRepositoryInterface extends BaseRepositoryInterface
{

    public function approvedTestimonials(): Collection;
}
