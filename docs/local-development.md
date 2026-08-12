# KrishiMitra — Local Development Setup (canonical)

One documented setup for the local KrishiMitra stack. Follow this on every machine / after every clone.

## Architecture

- `frontend/` — Next.js app (lives on the `frontend` branch).
- `backend/` — Laravel 12 API (lives on both branches; `config/cors.php` is committed on both).
- Two branches: `backend` and `frontend`. Do not merge them; do not move one app into the other.

## Canonical ports and URLs

| Component | URL | Start command (from repo root) |
|---|---|---|
| Frontend (Next.js) | http://localhost:3000 | `cd frontend` → `npm run dev` |
| Backend (Laravel) | http://127.0.0.1:8000 | `cd backend` → `php artisan serve` |
| API base URL | http://127.0.0.1:8000/v1 | — |

## First-time setup

Backend:

```sh
cd backend
composer install
cp .env.example .env        # then fill in real DB credentials (never commit .env)
php artisan key:generate
php artisan config:clear    # never leave a stale config cache
php artisan serve
```

Frontend:

```sh
cd frontend
npm install
cp .env.example .env
npm run dev
```

`frontend/.env` must contain the canonical API base:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/v1
```

It is consumed from exactly one place: `frontend/constants/api.ts` (`API_BASE_URL`).
All services use it via `frontend/services/axios.ts`. Do not hardcode API URLs elsewhere.

## Why CORS is configured this way

- The browser treats `http://localhost:3000` and `http://127.0.0.1:8000` as different origins.
- `backend/config/cors.php` explicitly allows both `http://localhost:3000` and
  `http://127.0.0.1:3000` as frontend origins and covers all `v1/*` API paths.
- If this file is missing, Laravel's CORS middleware silently does nothing and every browser
  request fails with a CORS error — the frontend then reports "Unable to reach the server".
- `allowed_origins` are explicit (not `*`) because requests carry `Authorization: Bearer` tokens.

## Troubleshooting

- CORS error on login/register → confirm `backend/config/cors.php` exists, then
  `php artisan config:clear` and restart `php artisan serve`.
- Frontend talks to the wrong API → confirm `frontend/.env` has `NEXT_PUBLIC_API_URL` and
  restart `npm run dev` (Next.js inlines env vars at startup; `.env` changes need a restart).
- Ports busy after a restart → stop the stale `node`/`php artisan serve` processes first.

## Verification

```sh
curl -i -X OPTIONS http://127.0.0.1:8000/v1/auth/login -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: POST"
```

The response must include `Access-Control-Allow-Origin: http://localhost:3000`.
