<?php

declare(strict_types=1);

namespace App\Services\Weather\Exceptions;

use RuntimeException;

/**
 * Thrown when an external weather provider cannot be reached or returns unusable data.
 */
class WeatherProviderException extends RuntimeException {}
