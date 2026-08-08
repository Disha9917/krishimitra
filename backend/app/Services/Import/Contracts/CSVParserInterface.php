<?php

declare(strict_types=1);

namespace App\Services\Import\Contracts;

interface CSVParserInterface
{
    /**
     * Parse a CSV file into normalized rows keyed by lowercased header name.
     *
     * @return array{
     *   headers: list<string>,
     *   rows: list<array<string, string|null>>,
     *   parse_errors: list<array{row: int, message: string}>
     * }
     */
    public function parse(string $filePath): array;
}
