<?php

$m = require 'database/migrations/2026_08_05_000019_create_uploaded_files_table.php';
try {
    $m->up();
    echo 'UP() SUCCEEDED' . PHP_EOL;
} catch (Throwable $e) {
    echo 'FAILED: ' . $e->getMessage() . PHP_EOL;
    echo 'Prev: ' . ($e->getPrevious() ? $e->getPrevious()->getMessage() : 'none') . PHP_EOL;
}
