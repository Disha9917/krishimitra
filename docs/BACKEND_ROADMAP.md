# Krishimitra Backend Roadmap

> Laravel 12 + Supabase PostgreSQL (pgsql, schema `public`, SSL required).
> Companion doc: `docs/API_CONTRACT.md` (53 endpoints derived from the frontend).

## 1. Proposed Directory Layout

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/        # API controllers
│   │   └── Middleware/             # Custom middleware (locale, tenant?)
│   ├── Models/                     # Eloquent models
│   ├── Services/                   # Business logic layer
│   ├── Enums/                      # PHP enums (roles, statuses, severity)
│   ├── DTOs/                       # Request/response DTOs
│   └── Jobs/                       # Queued jobs (report generation, notifications)
├── database/
│   ├── migrations/                 # Schema definitions (see §5)
│   └── seeders/                    # Districts, crops, mandis, schemes, equipment
├── routes/api.php                  # Versioned API routes (/v1 prefix)
├── config/                         # sanstum, cors, services (weather, ai)
└── storage/app/reports/            # Generated PDF/CSV reports
```

## 2. Suggested Laravel Controllers (`app/Http/Controllers/Api`)

| Controller | Module | Endpoints handled |
|------------|--------|-------------------|
| `AuthController` | Authentication | register, login, verify-otp, logout, me, forgot-password, reset-password |
| `ProfileController` | Farmer | me (GET/PUT), avatar upload |
| `PredictionHistoryController` | Farmer | list history, archive record |
| `WeatherController` | Weather | current, forecast |
| `CropController` | Crop | supported-crops, list, show |
| `CropAdvisoryController` | Crop Advisory | generate advisory, 7-day timeline |
| `DiseaseDetectionController` | Disease Detection | detect (upload), search |
| `MarketController` | Market Prices | prices, trends, transport-cost |
| `PostHarvestController` | Post-Harvest | analyze-risk |
| `SchemeController` | Government Schemes | list, show, eligibility |
| `SubsidyController` | Government Schemes | list |
| `EquipmentController` | Equipment Rental | list, show |
| `EquipmentBookingController` | Equipment Rental | create booking, my bookings, cancel |
| `ColdStorageController` | Cold Storage | list, show |
| `StorageBookingController` | Cold Storage | create booking, my bookings |
| `ReportController` | Reports | generate, list, download, delete |
| `NotificationController` | Notifications | list, unread-count, mark read, mark-all-read |
| `NotificationSettingController` | Notifications | get/update settings |
| `RegionController` | Reference Data | regions, districts, district-crop map |

**Count: 19 controllers** (thin controllers, logic delegated to services).

## 3. Suggested Laravel Services (`app/Services`)

| Service | Responsibility |
|---------|----------------|
| `AuthService` | OTP generation/verification, token issue (Sanctum), password reset |
| `OtpService` | OTP create/verify/expire + SMS/WhatsApp dispatch (Twilio/MSG91) |
| `ProfileService` | Farmer profile CRUD, avatar upload, alert preferences |
| `WeatherService` | Proxy to weather provider (OpenWeather), pin-code → lat/lng geocoding |
| `CropAdvisoryService` | Advisory engine: rules + weather + soil + AI prompt assembly |
| `DiseaseDetectionService` | Image storage, AI model inference wrapper, treatment knowledge base |
| `MarketPriceService` | Ingest APMC/mandi feed, cache, trend computation |
| `TransportCostService` | Distance API (OSRM/Google), freight rate matrix per truck type |
| `PostHarvestRiskService` | Spoilage model: crop × moisture × condition × shelf-life |
| `SchemeService` | Scheme catalog, eligibility rules engine |
| `EquipmentService` | Rental catalog, provider management |
| `BookingService` | Booking lifecycle (create/cancel/status) for equipment + storage |
| `ReportService` | PDF (DomPDF) / CSV generation, file storage, size metadata |
| `NotificationService` | Fan-out of PRICE/DISEASE/WEATHER/ADVISORY alerts, read tracking |
| `RegionService` | Districts/regions/crop maps (seeded reference data) |

**Count: 15 services.**

## 4. Suggested Laravel Models (`app/Models`)

| Model | Table | Notes |
|-------|-------|-------|
| `User` | `users` | Sanctum auth; role enum: Farmer, Extension Worker, Agronomist, Admin |
| `FarmerProfile` | `farmer_profiles` | farmSizeAcres, primaryCrop, pinCode, state, district, village, preferredLanguage, avatarUrl |
| `AlertPreference` | `alert_preferences` | sms/whatsapp/price/disease/weather toggles, minPriceThresholdINR (1:1 User) |
| `Region` | `regions` | id/slug, name, nameGujarati |
| `District` | `districts` | name, nameGujarati, regionId, defaultPincode |
| `Crop` | `crops` | name, nameGujarati, category, isPremium, baseYield, avgPricePerQtl, season, sowingPeriod |
| `DistrictCropMap` | `district_crop_map` | districtId, cropIds[] (JSON), dataConfidence |
| `CropAdvisory` | `crop_advisories` | farmerInput snapshot, top3 advisories JSON, generatedAt; belongsTo User |
| `AdvisoryDay` | `advisory_days` | day, date, weather, irrigation, fertilizer, diseaseRisk, notes (belongs to advisory) |
| `DiseasePrediction` | `disease_predictions` | cropName, diseaseName, scientificName, confidence, confidenceScore, imageUrl, severity, symptoms, treatment JSON |
| `MarketPrice` | `market_prices` | cropName, mandiName, state, todaysPrice, min/max, changePercentage, unit, trend |
| `PricePoint` | `price_points` | marketPriceId, label, price, date (weekly/monthly trend series) |
| `TransportCalculation` | `transport_calculations` | origin, destination, distanceKm, cost, profit calc (audit log) |
| `PostHarvestAnalysis` | `post_harvest_analyses` | input snapshot, spoilageRiskPercentage, riskLevel, decisions JSON |
| `Scheme` | `schemes` | title, category, description, benefits, eligibility, documents, state, deadline, links |
| `Subsidy` | `subsidies` | category, title, amount, eligibility |
| `Equipment` | `equipment` | name, type (tractor/harvester), rates, provider, pinCode, availability, imageUrl |
| `EquipmentBooking` | `equipment_bookings` | userId, equipmentId, startDate, endDate, location, status |
| `ColdStorageFacility` | `cold_storage_facilities` | name, location, pinCode, capacityTonnes, rates |
| `StorageBooking` | `storage_bookings` | userId, facilityId, crop, quantityKg, startDate, endDate, status |
| `Report` | `reports` | title, category, fileFormat, fileSize, summaryText, storagePath, userId |
| `Notification` | `notifications` | userId, type (PRICE/DISEASE/WEATHER/ADVISORY), title, message, read, actionUrl |
| `PredictionHistory` | `prediction_history` | userId, crop, predictionType, prediction, recommendation, confidence, location, status, downloadUrl |

**Count: 23 models.**

## 5. Suggested Database Tables (Supabase PostgreSQL)

```
users                        # + remember_token, timestamps (Sanctum personal_access_tokens)
personal_access_tokens       # Laravel Sanctum
farmer_profiles              # 1:1 users
alert_preferences            # 1:1 users
regions                      # seed: Gujarat zones (north-gujarat, etc.)
districts                    # seed: 33 districts w/ Gujarati names
crops                        # seed: wheat, paddy, cotton, tomato, ...
district_crop_map            # seed: district -> crop ids + confidence
crop_advisories              # user advisories (JSON snapshots)
advisory_days                # 7-day timelines per advisory
disease_predictions          # detection results + treatment JSON
market_prices                # latest APMC prices
price_points                 # 7/30-day trend series
transport_calculations       # cost/profit audit
post_harvest_analyses        # spoilage risk + SELL/STORE/TRANSPORT decisions
schemes                      # central schemes catalog
subsidies                    # subsidy catalog
equipment                    # tractor/harvester listings
equipment_bookings           # rental bookings
cold_storage_facilities      # facility listings
storage_bookings             # cold storage bookings
reports                      # generated report metadata (files on disk)
notifications                # user notifications
notification_settings        # (or use alert_preferences)
prediction_history           # activity feed for /users/me/history
failed_jobs, jobs, cache, sessions   # framework defaults (file-based in dev)
```

**Seeded reference data:** regions, districts, crops, district-crop maps, initial scheme/subsidy catalogs, sample equipment & cold-storage listings.

## 6. Auth Strategy

- **Sanctum (Bearer tokens)**; no Breeze/Jetstream UI — API-only.
- Login: phone/email + OTP (primary) or password (secondary).
- `RegisterPayload` → create User + FarmerProfile + default AlertPreference.
- Roles: `Farmer` (default), `Extension Worker`, `Agronomist`, `Admin`.
- Rate-limit auth endpoints (5/min); OTP expiry 10 min, max 5 attempts.

## 7. Third-Party Integrations (config/services.php)

1. **Weather:** OpenWeatherMap or WeatherAPI (current + 7-day forecast by pin/lat-lng).
2. **Mandi prices:** APMC e-Mandi data feed (e.g., AGMARKNET / mandi data APIs) — hourly sync job.
3. **Distance/transport:** OSRM (free) or Google Distance Matrix (rates per truck type).
4. **Disease detection:** ML vision API (custom model / Roboflow / HuggingFace) — multipart image.
5. **Advisory engine:** Rules-based + LLM assembly (crop × soil × weather × stage).
6. **SMS/WhatsApp:** MSG91 / Twilio for OTP + alert fan-out.

## 8. Implementation Phases

| Phase | Scope | Deliverables |
|-------|-------|--------------|
| **3** | Foundation | Migrations + models + seeders; Sanctum auth (register/login/OTP/me); `ApiResponse` helper; error handling; CORS |
| **4** | Reference Data | Regions/districts/crops endpoints; profile + alert settings + avatar |
| **5** | Weather + Market | Weather proxy; market prices + trends + transport cost |
| **6** | Crop Advisory | Advisory engine + 7-day timeline + history persistence |
| **7** | Disease Detection | Upload + inference + treatment KB + search |
| **8** | Post-Harvest | Spoilage risk + storage facilities + bookings |
| **9** | Schemes + Equipment | Scheme/subsidy catalog + eligibility; equipment rentals |
| **10** | Reports + Notifications | PDF/CSV generation + download; notification fan-out + settings |
| **11** | Hardening | Rate limiting, tests, audit, pagination polish |

## 9. Non-Functional Requirements

- All endpoints under `/api/v1`; JSON envelope `{success, message, data, timestamp, errorCode}`.
- Pagination: `page`/`limit` (default 10, max 100); search via `q`; filters per module.
- CORS: allow the frontend origin; `Accept: application/json` on requests.
- Supabase specifics: SSL required, transaction pooler port 6543, schema `public`.
- File storage: local disk (dev) → S3-compatible (prod); reports in `storage/app/reports`.
- Queues: `database` in prod for report generation & notifications (file/sync in dev).
