<?php

declare(strict_types=1);

use App\Services\AIAdvisory\Providers\Gemini\GeminiProvider;
use App\Services\AIAdvisory\Providers\NullAIProvider;

return [

    /*
    |--------------------------------------------------------------------------
    | Active AI provider
    |--------------------------------------------------------------------------
    |
    | The provider key resolved from the providers map below. Swap this value
    | (or the AI_PROVIDER env var) to change the underlying AI vendor without
    | touching any controller or service code.
    |
    */

    'provider' => env('AI_PROVIDER') ?? 'null',

    /*
    |--------------------------------------------------------------------------
    | Provider registry
    |--------------------------------------------------------------------------
    |
    | Every swappable provider is registered here. New providers (OpenAI,
    | Claude, ...) are added to this map and bound through
    | AIProviderInterface without any controller changes.
    |
    */

    'providers' => [
        'null' => NullAIProvider::class,
        'gemini' => GeminiProvider::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Gemini provider
    |--------------------------------------------------------------------------
    |
    | Connection and generation settings for the Google Gemini API. Every
    | value is overridable through the environment; the provider never
    | hardcodes credentials or generation parameters.
    |
    */

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
        'model' => env('AI_MODEL', 'gemini-3.5-flash'),
        'temperature' => (float) env('GEMINI_TEMPERATURE', 0.7),
        'top_p' => (float) env('GEMINI_TOP_P', 0.95),
        'top_k' => (int) env('GEMINI_TOP_K', 40),
        'max_output_tokens' => (int) env('GEMINI_MAX_OUTPUT_TOKENS', 2048),
        'timeout' => (int) env('GEMINI_TIMEOUT_SECONDS', 30),
        'retry_max_attempts' => (int) env('GEMINI_RETRY_MAX_ATTEMPTS', 2),
        'retry_base_delay_ms' => (int) env('GEMINI_RETRY_BASE_DELAY_MS', 250),
    ],

    /*
    |--------------------------------------------------------------------------
    | Default history page size
    |--------------------------------------------------------------------------
    */

    'history_limit' => 20,

    /*
    |--------------------------------------------------------------------------
    | Prompt builder limits
    |--------------------------------------------------------------------------
    */

    'prompt_max_context_sections' => 50,

    /*
    |--------------------------------------------------------------------------
    | Context engine
    |--------------------------------------------------------------------------
    |
    | The context engine aggregates structured context from the existing
    | module services (weather, soil, crop, disease, market, schemes,
    | equipment, cold storage, transport, unified dashboard) into every
    | advisory request. Each section degrades gracefully when its module
    | data is unavailable, so an advisory never fails because of one module.
    |
    */

    'context_enabled' => (bool) env('AI_CONTEXT_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Scheme eligibility evaluation limit for advisory context
    |--------------------------------------------------------------------------
    |
    | Evaluating eligibility runs several queries per scheme; the context
    | engine only evaluates the newest N active schemes to keep advisory
    | requests bounded.
    |
    */

    'context_scheme_eligibility_limit' => env('AI_CONTEXT_SCHEME_ELIGIBILITY_LIMIT') !== null
        ? (int) env('AI_CONTEXT_SCHEME_ELIGIBILITY_LIMIT')
        : 5,
];
