# Frontend ↔ Backend Integration Map (Phase 15A)

> Maps existing KrishiMitra frontend features to Laravel backend endpoints.
> Base URL: `NEXT_PUBLIC_API_URL` (`http://127.0.0.1:8000/v1` locally — routes are registered
> under `/v1` with no `/api` segment; see `php artisan route:list`).
> Envelope: `{ success, message, data, timestamp, errorCode }`. Auth: `Authorization: Bearer <token>` (Sanctum).

Status legend:
- **REGISTERED** — endpoint exists in `backend/routes/api.php` (Phase 15A wiring target).
- **CONTRACTED** — defined in `docs/API_CONTRACT.md`; not yet registered on the backend (Phase 15B+ wiring target).

## 1. Authentication — `app/login`, `app/register`, `app/forgot-password`

| Feature | Endpoint | Method | Status | Consumer |
|---|---|---|---|---|
| Register (creates account + sends OTP) | `/auth/register` | POST | REGISTERED | `authService.register` |
| Request OTP | `/auth/request-otp` | POST | REGISTERED | `authService.requestOtp` |
| Login (password or OTP) | `/auth/login` | POST | REGISTERED | `authService.login` |
| Verify OTP (login/register) | `/auth/verify-otp` | POST | REGISTERED | `authService.verifyOtp` |
| Refresh tokens | `/auth/refresh` | POST | REGISTERED | `authService.refresh` |
| Logout | `/auth/logout` | POST | REGISTERED | `authService.logout` |
| Current user | `/auth/me` | GET | REGISTERED | `authService.getCurrentUser` |
| Forgot password | `/auth/forgot-password` | POST | REGISTERED | `authService.forgotPassword` |
| Reset password | `/auth/reset-password` | POST | REGISTERED | `authService.resetPassword` |

## 2. Dashboard — `app/dashboard/page.tsx` + `components/dashboard/*`

| Feature | Endpoint | Method | Status |
|---|---|---|---|
| Farmer profile / dashboard stats | `/farmer/dashboard` | GET | REGISTERED |
| Weather insights module | `/weather/dashboard`, `/weather/current`, `/weather/forecast`, `/weather/alerts`, `/weather/rain-prediction`, `/weather/temperature-trend`, `/weather/humidity-trend` | GET | REGISTERED |
| Notifications panel (`notification-panel.tsx`, `notifications-module.tsx`) | `/weather/notifications`, `/weather/notifications/generate` | GET/POST | REGISTERED |
| Recent activity / prediction history | `/farmer/crops/history` | GET | REGISTERED |
| AI recommendation section (`ai-recommendation-section.tsx`) | `/farmer/crops/summary`, `/farmer/crops/active` | GET | REGISTERED |
| Crop recommendation module | `/farmer/crops`, `/farmer/crops/seasonal`, `/farmer/crops/calendar` | GET | REGISTERED |
| Reports module (`reports-module.tsx`) | `/reports` | GET | CONTRACTED |

## 3. Farmer / Profile — `user.service.ts`, `nav-user.tsx`

| Feature | Endpoint | Method | Status |
|---|---|---|---|
| Get profile | `/farmer/me` | GET | REGISTERED |
| Update profile | `/farmer/me` | PUT/PATCH | REGISTERED |
| Fields (list/create/show/update/delete) | `/farmer/fields`, `/farmer/fields/{fieldId}` | GET/POST/GET/PUT/PATCH/DELETE | REGISTERED |

## 4. Crop — `crop.service.ts`, `crop-recommendation-module.tsx`, `crop-card.tsx`

| Feature | Endpoint | Method | Status |
|---|---|---|---|
| Crop CRUD (my crops) | `/farmer/crops`, `/farmer/crops/{cropId}` | GET/POST/PUT/PATCH/DELETE | REGISTERED |
| Crop calendar | `/farmer/crops/calendar` | GET | REGISTERED |
| Harvest summary | `/farmer/crops/harvest-summary` | GET | REGISTERED |
| History | `/farmer/crops/history` | GET | REGISTERED |
| Active / seasonal / summary | `/farmer/crops/active`, `/seasonal`, `/summary` | GET | REGISTERED |
| Timeline / growth / status | `/farmer/crops/{id}/timeline`, `/growth`, `/status` | GET | REGISTERED |
| AI advisory (mock `cropService.generateAdvisory`) | `/crop/advisory` | POST | CONTRACTED |
| Supported crops catalog (static `data/crops.ts`) | `/crop/supported-crops`, `/crops` | GET | CONTRACTED |

## 5. Soil

| Feature | Endpoint | Method | Status |
|---|---|---|---|
| Field soil type (`FarmerFieldResource.soilType`) | embedded in `/farmer/fields` | GET | REGISTERED |
| Soil test records / analysis | `/soil/records` (proposed) | — | CONTRACTED (planned) |

## 6. Disease — `disease.service.ts`, `disease-detection-module.tsx`

| Feature | Endpoint | Method | Status |
|---|---|---|---|
| Detect disease from image (multipart) | `/disease/detect` | POST | CONTRACTED |
| Knowledge-base search | `/disease/search` | GET | CONTRACTED |

## 7. Market — `market.service.ts`, `live-mandi-prices`, `nearby-mandi`, `nearest-mandi`, `price-trend-chart.tsx`

| Feature | Endpoint | Method | Status |
|---|---|---|---|
| Mandi prices | `/market/prices` | GET | CONTRACTED |
| Price trends | `/market/trends` | GET | CONTRACTED |
| Transport cost (`transport-calculator.tsx`) | `/market/transport-cost` | POST | CONTRACTED |

## 8. Government Schemes — `central-schemes`, `government-subsidies`, `schemes/[id]`

| Feature | Endpoint | Method | Status |
|---|---|---|---|
| Scheme list (search/filter) | `/schemes` | GET | CONTRACTED |
| Scheme detail | `/schemes/{id}` | GET | CONTRACTED |
| Eligibility check | `/schemes/{id}/eligibility` | POST/GET | CONTRACTED |
| Subsidies | `/subsidies` | GET | CONTRACTED |

## 9. Equipment — `tractor-rent`, `harvester-rent`

| Feature | Endpoint | Method | Status |
|---|---|---|---|
| Equipment list (by type) | `/equipment` | GET | CONTRACTED |
| Equipment detail | `/equipment/{id}` | GET | CONTRACTED |
| Bookings (create / mine / cancel) | `/equipment/{id}/bookings`, `/equipment/bookings/me` | POST/GET | CONTRACTED |

## 10. Cold Storage — `cold-storage`, `storage-rent`

| Feature | Endpoint | Method | Status |
|---|---|---|---|
| Facility list | `/cold-storage` | GET | CONTRACTED |
| Facility detail | `/cold-storage/{id}` | GET | CONTRACTED |
| Bookings (create / mine) | `/cold-storage/{id}/bookings`, `/cold-storage/bookings/me` | POST/GET | CONTRACTED |

## 11. Transport

| Feature | Endpoint | Method | Status |
|---|---|---|---|
| Transport cost calculator | `/market/transport-cost` | POST | CONTRACTED |

## 12. Reports — `reports-module.tsx`, `report.service.ts`, `report-export-buttons.tsx`

| Feature | Endpoint | Method | Status |
|---|---|---|---|
| Generate report | `/reports/generate` | POST | CONTRACTED |
| Report list | `/reports` | GET | CONTRACTED |
| Download (binary) | `/reports/download/{id}` | GET | CONTRACTED |
| Delete | `/reports/{id}` | DELETE | CONTRACTED |

## 13. Notifications — `notification-panel.tsx`, `notifications-module.tsx`

| Feature | Endpoint | Method | Status |
|---|---|---|---|
| List / filter | `/notifications` | GET | CONTRACTED |
| Unread count | `/notifications/unread-count` | GET | CONTRACTED |
| Mark all read / mark read | `/notifications/mark-all-read`, `/notifications/{id}/read` | POST | CONTRACTED |
| Settings (get/update) | `/notifications/settings` | GET/PUT | CONTRACTED |
| Weather notifications | `/weather/notifications`, `/weather/notifications/generate` | GET/POST | REGISTERED |

## 14. AI Advisory — `ai-recommendation-section.tsx`, `crop-recommendation-module.tsx`

| Feature | Endpoint | Method | Status |
|---|---|---|---|
| Advisory generation (currently mocked) | `/crop/advisory` | POST | CONTRACTED |
| 7-day timeline | `/crop/7-day-timeline` | GET | CONTRACTED |
| Farmer crop data feeding the advisory | `/farmer/crops`, `/farmer/crops/{id}/growth` | GET | REGISTERED |

---

## API client

`frontend/services/axios.ts` (`apiClient`) — GET/POST/PUT/PATCH/DELETE, Bearer token from
`frontend/store/token.store.ts`, unwraps the `data` field of the backend envelope, and normalizes
all errors (401/403/404/422/429/500/network) into a single `ApiError` object
(`types/api.ts`). 401 clears tokens and dispatches `krishimitra:unauthorized`.

## Verification (Phase 15A)

- `npm run lint` — lint (see next lint support in Next 16).
- `npx tsc --noEmit` — typecheck.
- `npm run build` — production build.

No feature has been switched to live API calls yet; mock stores (`store/*`) still back the UI.
Wiring happens in Phase 15B (Login → Dashboard).
