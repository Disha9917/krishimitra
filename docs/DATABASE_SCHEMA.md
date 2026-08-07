# KrishiMitra — Master Database Architecture

> **Stack:** Laravel 12 · Supabase PostgreSQL (schema `public`, SSL) · Next.js frontend
> **Scope:** ONE production database, every feature = dedicated table(s). No PHP/SQL generated — design only.
> **Companion docs:** `docs/API_CONTRACT.md` (53 endpoints) · `docs/BACKEND_ROADMAP.md`

---

## 1. Design Principles

1. **Single database, single source of truth** — no multi-DB split; scale via indexes, partitioning, read replicas (see §Scalability).
2. **Normalized to 3NF for reference data** (regions → districts → talukas → villages); **denormalized snapshots for history** (advisories, predictions store input JSON snapshots so past records survive reference-data changes).
3. **Ownership-first** — every user-generated row carries `user_id` (or inherits it through a parent).
4. **Soft deletes everywhere** (`deleted_at`) — farmers' history and analytics must never hard-disappear.
5. **JSONB only where the frontend demands dynamic shapes** (alert preferences, decision matrices, treatment arrays, advisory payloads) — never for queryable business columns.
6. **IDs:** `BIGINT` auto-increment PKs for most tables (Supabase/Postgres default), `UUID` for externally exposed resources (reports, uploads, bookings) to avoid enumeration. All PKs named `id`.
7. **Timestamps:** every table has `created_at`, `updated_at`; append-only/event tables also get `performed_at`/`occurred_at`.
8. **Enums as Postgres ENUM types** where the set is closed (role, status, severity, notification type); `VARCHAR` + CHECK where enums may evolve (transport type).

---

## 2. Naming Conventions

| Concern | Rule |
|---|---|
| Tables | `snake_case` plural (`market_prices`) |
| Columns | `snake_case` (`todays_price`) |
| PK | `id BIGSERIAL PRIMARY KEY` |
| FK | `<entity>_id` (e.g. `farmer_id`) |
| Indexes | `idx_<table>_<cols>`; unique: `uq_<table>_<cols>` |
| Boolean | `is_*` / `*_enabled` |
| Timestamps | `created_at`, `updated_at`, `deleted_at` (soft delete) |
| Soft delete | `deleted_at TIMESTAMPTZ NULL` (NULL = active) |
| Money | `NUMERIC(12,2)` in INR, never FLOAT |
| Percent | `NUMERIC(5,2)` |
| Date/Time | `TIMESTAMPTZ` (UTC storage) |

---

## 3. Complete Table Inventory (60 tables)

### Master / Reference (12)
`regions`, `districts`, `talukas`, `villages`, `crops`, `crop_varieties`, `soil_types`, `diseases`, `weather_stations`, `mandis`, `transport_vehicle_types`, `schemes`

### Authentication & Access (7)
`users`, `otps`, `roles`, `permissions`, `role_permission`, `user_role`, `personal_access_tokens`

### Farmer (6)
`farmer_profiles`, `farmer_fields`, `farmer_documents`, `farmer_crops`, `crop_calendar`, `harvests`

### Crop Advisory (2)
`crop_recommendations`, `ai_advisories`

### Soil (3)
`soil_types` *(master, above)*, `soil_tests`, `soil_history`

### Weather (4)
`weather_cache`, `weather_forecasts`, `weather_alerts` *(+ `weather_stations` master)*

### Disease Detection (5)
`disease_detections`, `disease_images`, `disease_history`, `treatment_recommendations` *(+ `diseases` master)*

### Market (5)
`market_prices`, `price_predictions`, `nearby_mandis` *(+ `mandis` master)*

### Government Schemes (2)
`scheme_applications` *(+ `schemes` master)*

### Equipment Rental (2)
`equipment_listings`, `rental_bookings`

### Cold Storage (2)
`cold_storages`, `storage_bookings`

### Transportation (2)
`transport_calculations`, `transport_routes`

### AI (2)
`prediction_history`, `chat_history` *(+ `ai_advisories`)*

### Reports & Files (4)
`reports`, `export_history`, `uploaded_files`, `dashboard_analytics`

### Notifications & Settings (7)
`notifications`, `notification_settings`, `user_settings`, `language_settings`, `theme_settings`, `activity_logs`, `audit_logs`

### Support & Content (4)
`feedback`, `contact_requests`, `faqs`, `testimonials`

---

## 4. Master / Reference Data (Gujarat-ready)

> All master tables are **CSV-import ready**: every row has `code` (stable slug/identifier) so dataset re-imports UPSERT by `code` without duplicating rows. Import via `pg_copy`/COPY for bulk loads.

### 4.1 `regions`
**Purpose:** Gujarat zones (e.g., North Gujarat, Saurashtra, Kutch) — top of the geographic hierarchy. Used by landing/region pages, `Region[]` endpoint.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| code | VARCHAR(50) | NO | — | stable slug e.g. `north-gujarat`; **UNIQUE** |
| name | VARCHAR(100) | NO | — | `North Gujarat` |
| name_gujarati | VARCHAR(100) | YES | NULL | `ઉત્તર ગુજરાત` |
| display_order | SMALLINT | NO | 0 | UI sort |
| is_active | BOOLEAN | NO | true | |
| created_at / updated_at | TIMESTAMPTZ | NO | now() | |
| deleted_at | TIMESTAMPTZ | YES | NULL | soft delete |

**Indexes:** `uq_regions_code`. **Frontend:** `frontend/lib/regionData.ts`, `/regions`.

### 4.2 `districts`
**Purpose:** All 33 Gujarat districts; FK to region. Powers district crop maps and pin-code resolution.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| region_id | BIGINT | NO | — | FK → `regions.id` (cascade restrict) |
| code | VARCHAR(50) | NO | — | slug e.g. `banaskantha`; **UNIQUE** |
| name | VARCHAR(100) | NO | — | |
| name_gujarati | VARCHAR(100) | YES | NULL | |
| default_pincode | VARCHAR(6) | YES | NULL | used for weather/market fallback |
| is_active | BOOLEAN | NO | true | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_districts_region_id`, `uq_districts_code`. **Frontend:** `DistrictCropMap`, district dropdowns.

### 4.3 `talukas`
**Purpose:** Sub-district administrative units; required for precise weather/market/soil resolution.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| district_id | BIGINT | NO | — | FK → `districts.id` |
| code | VARCHAR(50) | NO | — | **UNIQUE** |
| name | VARCHAR(100) | NO | — | |
| name_gujarati | VARCHAR(100) | YES | NULL | |
| default_pincode | VARCHAR(6) | YES | NULL | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_talukas_district_id`, `uq_talukas_code`.

### 4.4 `villages`
**Purpose:** Future-proofed (per user spec) — village-level granularity for advisories, mandi distance, cold storage siting.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| taluka_id | BIGINT | NO | — | FK → `talukas.id` |
| code | VARCHAR(50) | NO | — | **UNIQUE** |
| name | VARCHAR(150) | NO | — | |
| pincode | VARCHAR(6) | YES | NULL | |
| lat / lng | NUMERIC(9,6) | YES | NULL | geocoded |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_villages_taluka_id`, `idx_villages_pincode`.

### 4.5 `crops` (Crop Master)
**Purpose:** The crop catalog from `Crop[]` type — includes Gujarati names, premium flag, season, yield, price. Drives supported-crops endpoint and district maps.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| code | VARCHAR(50) | NO | — | slug `wheat`; **UNIQUE** |
| name | VARCHAR(100) | NO | — | `Wheat` |
| name_gujarati | VARCHAR(100) | NO | — | `ઘઉં` |
| category | VARCHAR(50) | NO | `traditional` | `traditional | high-value | controlled-environment` |
| is_premium | BOOLEAN | NO | false | locks high-value crops |
| base_yield | VARCHAR(50) | YES | NULL | `15 Qtl/Acre` |
| avg_price_per_qtl | NUMERIC(10,2) | YES | NULL | APMC benchmark |
| season | VARCHAR(30) | YES | NULL | `Kharif | Rabi | Summer | Annual | Perennial` |
| sowing_period | VARCHAR(100) | YES | NULL | `Jun 15 - Jul 15` |
| crop_icon_url | VARCHAR(255) | YES | NULL | |
| is_active | BOOLEAN | NO | true | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `uq_crops_code`, `idx_crops_season`, `idx_crops_category`. **Frontend:** `CROP_OPTIONS`, `/crop/supported-crops`.

### 4.6 `crop_varieties`
**Purpose:** Named varieties (HD-2967 wheat, PBW-550) referenced by advisories, disease resistance, treatments.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| crop_id | BIGINT | NO | — | FK → `crops.id` |
| name | VARCHAR(100) | NO | — | |
| is_disease_resistant | BOOLEAN | NO | false | |
| avg_duration_days | SMALLINT | YES | NULL | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_crop_varieties_crop_id`, `uq_crop_varieties_crop_name` (crop_id, name).

### 4.7 `soil_types`
**Purpose:** Master list (alluvial, black cotton, laterite, sandy…) used by advisory inputs and soil tests.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| code | VARCHAR(50) | NO | — | **UNIQUE** |
| name | VARCHAR(100) | NO | — | |
| water_retention_desc | TEXT | YES | NULL | advisory hint |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

### 4.8 `diseases` (Disease Master)
**Purpose:** Knowledge base for `/disease/search` — disease names, symptoms, treatments, severity, affected crops.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| crop_id | BIGINT | YES | NULL | FK → `crops.id` (null = multi-crop) |
| code | VARCHAR(50) | NO | — | **UNIQUE** |
| name | VARCHAR(150) | NO | — | `Yellow Rust` |
| scientific_name | VARCHAR(150) | YES | NULL | |
| severity_default | VARCHAR(10) | NO | `Moderate` | `Mild | Moderate | Severe` |
| symptoms | JSONB | NO | '[]' | array of strings (frontend shape) |
| preventive_measures | JSONB | NO | '[]' | array of strings |
| chemical_treatments | JSONB | YES | NULL | array of strings |
| organic_treatments | JSONB | YES | NULL | array of strings |
| recommended_product | VARCHAR(255) | YES | NULL | |
| dosage | VARCHAR(255) | YES | NULL | |
| image_url | VARCHAR(255) | YES | NULL | reference image |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_diseases_crop_id`, `uq_diseases_code`, `idx_diseases_name` (GIN trigram for search). **Frontend:** `/disease/search`.

### 4.9 `weather_stations`
**Purpose:** Reference points (IMD/OpenWeather stations) per region for forecast + alert attribution.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| code | VARCHAR(50) | NO | — | **UNIQUE** |
| name | VARCHAR(150) | NO | — | |
| district_id | BIGINT | YES | NULL | FK → `districts.id` |
| lat / lng | NUMERIC(9,6) | NO | — | |
| provider | VARCHAR(50) | NO | `openweather` | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_weather_stations_district_id`, `idx_weather_stations_lat_lng` (lat, lng).

### 4.10 `mandis`
**Purpose:** APMC mandi master (Khanna, Azadpur, Ludhiana…) for prices, nearby-mandi search, transport destination price.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| code | VARCHAR(50) | NO | — | **UNIQUE** |
| name | VARCHAR(150) | NO | — | |
| state | VARCHAR(50) | NO | — | |
| district_id | BIGINT | YES | NULL | FK → `districts.id` |
| pincode | VARCHAR(6) | YES | NULL | |
| lat / lng | NUMERIC(9,6) | YES | NULL | |
| apmc_id_external | VARCHAR(50) | YES | NULL | AGMARKNET source id |
| is_active | BOOLEAN | NO | true | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `uq_mandis_code`, `idx_mandis_state`, `idx_mandis_district_id`, `idx_mandis_pincode`, GIN trigram `idx_mandis_name`. **Frontend:** `/services/live-mandi-prices`, `/services/nearby-mandi`, `/services/nearest-mandi`.

### 4.11 `transport_vehicle_types`
**Purpose:** Master for truck types from `TRANSPORT_TYPES` (Mini Truck, Medium Truck, Heavy Truck, Cold Chain Reefer) with rate matrix.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| code | VARCHAR(50) | NO | — | **UNIQUE** |
| name | VARCHAR(80) | NO | — | `Medium Truck (5-10 Ton)` |
| min_capacity_kg | INT | NO | — | |
| max_capacity_kg | INT | NO | — | |
| rate_per_km_per_qtl | NUMERIC(6,3) | NO | — | freight matrix |
| avg_speed_kmph | SMALLINT | NO | 45 | transit time calc |
| is_active | BOOLEAN | NO | true | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

### 4.12 `schemes`
**Purpose:** Government schemes/subsidies catalog for `/schemes` + `/subsidies` endpoints (central + state schemes).
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| code | VARCHAR(50) | NO | — | **UNIQUE** |
| title | VARCHAR(255) | NO | — | |
| category | VARCHAR(80) | NO | — | `Subsidy | Loan | Insurance | Training…` |
| description | TEXT | YES | NULL | |
| benefits | JSONB | YES | NULL | |
| eligibility_criteria | JSONB | YES | NULL | |
| documents_required | JSONB | YES | NULL | |
| state | VARCHAR(50) | YES | NULL | NULL = central |
| deadline | DATE | YES | NULL | |
| apply_url | VARCHAR(255) | YES | NULL | |
| official_link | VARCHAR(255) | YES | NULL | |
| is_active | BOOLEAN | NO | true | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `uq_schemes_code`, `idx_schemes_category`, `idx_schemes_state`, GIN trigram `idx_schemes_title`. **Frontend:** `/dashboard/schemes`, `/services/central-schemes`, `/services/government-subsidies`.

---

## 5. Authentication & Access Control

### 5.1 `users`
**Purpose:** Auth + base profile (`AuthState`, `UserProfile.id/phone/email/role`). One account per farmer; identity for all ownership checks.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| uuid | UUID | NO | gen_random_uuid() | public identifier; **UNIQUE** |
| full_name | VARCHAR(150) | NO | — | |
| phone | VARCHAR(10) | NO | — | `^[6-9]\d{9}$`; **UNIQUE** |
| email | VARCHAR(255) | YES | NULL | **UNIQUE (partial, WHERE email IS NOT NULL)** |
| phone_verified_at | TIMESTAMPTZ | YES | NULL | |
| email_verified_at | TIMESTAMPTZ | YES | NULL | |
| password_hash | VARCHAR(255) | YES | NULL | null for OTP-only accounts |
| avatar_url | VARCHAR(255) | YES | NULL | FK-ish → uploaded_files |
| preferred_language | VARCHAR(10) | NO | `en` | `en | gu` |
| is_active | BOOLEAN | NO | true | |
| last_login_at | TIMESTAMPTZ | YES | NULL | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `uq_users_phone`, `uq_users_email`, `uq_users_uuid`, `idx_users_is_active`. **Frontend:** login/register/me (endpoints 1–8, 9–12).

### 5.2 `otps`
**Purpose:** Phone/email OTP lifecycle (login, registration, forgot-password). Append-only with expiry.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | YES | NULL | FK → `users.id` (null for pre-registration) |
| channel | VARCHAR(10) | NO | `sms` | `sms | whatsapp | email` |
| destination | VARCHAR(255) | NO | — | phone/email |
| code_hash | VARCHAR(255) | NO | — | bcrypt hash, never plaintext |
| purpose | VARCHAR(30) | NO | `login` | `login | register | password_reset` |
| expires_at | TIMESTAMPTZ | NO | now()+interval '10 minutes' | |
| attempts | SMALLINT | NO | 0 | max 5 |
| consumed_at | TIMESTAMPTZ | YES | NULL | |
| created_at | TIMESTAMPTZ | NO | now() | no update needed (append-only) |

**Indexes:** `idx_otps_destination_purpose`, `idx_otps_consumed_at`, `idx_otps_user_id`. **Frontend:** verify-otp, forgot-password pages.

### 5.3 `roles` / `permissions` / `role_permission` / `user_role`
**Purpose:** Full RBAC (per `lib/permissions`: Admin-only access; roles Farmer, Extension Worker, Agronomist, Admin). Users ↔ roles M:N; roles ↔ permissions M:N.
| Table | Columns | Notes |
|---|---|---|
| `roles` | id PK, code **UNIQUE** (`farmer|extension_worker|agronomist|admin`), name, description, is_system, timestamps+deleted_at | |
| `permissions` | id PK, code **UNIQUE** (`reports.export`, `schemes.manage`, `users.manage`…), name, module, timestamps+deleted_at | |
| `role_permission` | role_id FK, permission_id FK, PK (role_id, permission_id), timestamps | pivot; cascade delete on both FKs |
| `user_role` | user_id FK, role_id FK, PK (user_id, role_id), timestamps | pivot; cascade on user, restrict on role |

**Indexes:** `idx_role_permission_permission_id`, `idx_user_role_role_id`, `idx_user_role_user_id`.

### 5.4 `personal_access_tokens`
**Purpose:** Laravel Sanctum bearer tokens (per contract §0 auth). Standard Laravel schema — **do not modify**.

---

## 6. Farmer Module

### 6.1 `farmer_profiles`
**Purpose:** 1:1 extension of `users` carrying agri-specific profile (`UserProfile`: farm size, primary crop, pin, state, district, village, alert prefs).
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | NO | — | FK → `users.id`; **UNIQUE** (1:1) |
| farm_size_acres | NUMERIC(7,2) | YES | NULL | |
| primary_crop_id | BIGINT | YES | NULL | FK → `crops.id` |
| pincode | VARCHAR(6) | NO | — | validated `^[1-9][0-9]{5}$` |
| state | VARCHAR(50) | YES | NULL | |
| district_id | BIGINT | YES | NULL | FK → `districts.id` |
| taluka_id | BIGINT | YES | NULL | FK → `talukas.id` |
| village | VARCHAR(150) | YES | NULL | free-text/`villages.id` future |
| alert_preferences | JSONB | NO | default object | mirrors `alertPreferences` shape |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `uq_farmer_profiles_user_id`, `idx_farmer_profiles_pincode`, `idx_farmer_profiles_district_id`. **Frontend:** profile page, alert-settings form.

### 6.2 `farmer_fields`
**Purpose:** Multiple land parcels per farmer (field name, size, soil, crop, coordinates) — foundation for precision advisories.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | NO | — | FK → `users.id` |
| name | VARCHAR(100) | NO | — | |
| size_acres | NUMERIC(7,2) | NO | — | |
| soil_type_id | BIGINT | YES | NULL | FK → `soil_types.id` |
| current_crop_id | BIGINT | YES | NULL | FK → `crops.id` |
| lat / lng | NUMERIC(9,6) | YES | NULL | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_farmer_fields_user_id`, `idx_farmer_fields_current_crop_id`.

### 6.3 `farmer_documents`
**Purpose:** KYC/scheme documents (Aadhaar, land records, bank passbook) for scheme applications; private files.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | NO | — | FK → `users.id` |
| document_type | VARCHAR(50) | NO | — | `aadhaar | land_record | bank_passbook | other` |
| file_id | BIGINT | NO | — | FK → `uploaded_files.id` |
| verification_status | VARCHAR(20) | NO | `pending` | `pending | verified | rejected` |
| verified_by | BIGINT | YES | NULL | FK → `users.id` (admin/worker) |
| verified_at | TIMESTAMPTZ | YES | NULL | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_farmer_documents_user_id`, `idx_farmer_documents_status`.

### 6.4 `farmer_crops`
**Purpose:** M:N pivot with context — which crops a farmer grows (or has grown), with sowing/harvest dates. Feeds history and recommendations.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | NO | — | FK → `users.id` |
| crop_id | BIGINT | NO | — | FK → `crops.id` |
| field_id | BIGINT | YES | NULL | FK → `farmer_fields.id` |
| season | VARCHAR(30) | YES | NULL | |
| sowing_date | DATE | YES | NULL | |
| expected_harvest_date | DATE | YES | NULL | |
| is_current | BOOLEAN | NO | true | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_farmer_crops_user_id`, `idx_farmer_crops_crop_id`, `idx_farmer_crops_sowing_date`.

### 6.5 `crop_calendar`
**Purpose:** Per-crop generic operational calendar (stage-based activities) — seed for the 7-day timeline and irrigation planner.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| crop_id | BIGINT | NO | — | FK → `crops.id` |
| stage | VARCHAR(50) | NO | — | `sowing | vegetative | flowering | grain-filling | harvest` |
| day_start | SMALLINT | NO | — | days after sowing |
| day_end | SMALLINT | YES | NULL | |
| activity | VARCHAR(255) | NO | — | e.g. `Top-dress Urea 25kg/acre` |
| fertilizer_json | JSONB | YES | NULL | |
| irrigation_json | JSONB | YES | NULL | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_crop_calendar_crop_id_stage`. **Frontend:** irrigation-planner-module, crop advisory timeline.

### 6.6 `harvests`
**Purpose:** Harvest records per farmer-crop (yield, quality, moisture) — historical yield analytics and market guidance.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | NO | — | FK → `users.id` |
| farmer_crop_id | BIGINT | YES | NULL | FK → `farmer_crops.id` |
| crop_id | BIGINT | NO | — | FK → `crops.id` |
| harvest_date | DATE | NO | — | |
| quantity_kg | NUMERIC(12,2) | NO | — | |
| yield_per_acre | NUMERIC(10,2) | YES | NULL | |
| moisture_pct | NUMERIC(5,2) | YES | NULL | |
| quality_grade | VARCHAR(20) | YES | NULL | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_harvests_user_id`, `idx_harvests_crop_id_date` (crop_id, harvest_date).

---

## 7. Crop Advisory & AI Module

### 7.1 `crop_recommendations`
**Purpose:** Crop recommendation output for `FarmerCropInput` (district, land size, season, soil…) → ranked `RecommendationItem[]` with reasons.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | YES | NULL | FK → `users.id` (null = anonymous) |
| input_snapshot | JSONB | NO | — | full `FarmerCropInput` |
| recommendations | JSONB | NO | — | `RecommendationItem[]` |
| selected_crop_id | BIGINT | YES | NULL | FK → `crops.id` |
| generated_at | TIMESTAMPTZ | NO | now() | |
| model_version | VARCHAR(30) | YES | NULL | AI model version |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_crop_recommendations_user_id`, `idx_crop_recommendations_generated_at`. **Frontend:** crop-recommendation-module.

### 7.2 `ai_advisories`
**Purpose:** The full `CropAdvisoryResult` (top-3 advisories, irrigation, fertilizer, pest alert, 7-day timeline) — one row per generation; snapshot preserves historical outputs.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | YES | NULL | FK → `users.id` |
| farmer_crop_id | BIGINT | YES | NULL | FK → `farmer_crops.id` |
| crop_id | BIGINT | YES | NULL | FK → `crops.id` |
| district_id | BIGINT | YES | NULL | FK → `districts.id` |
| pincode | VARCHAR(6) | YES | NULL | |
| input_snapshot | JSONB | NO | — | |
| top3_advisories | JSONB | NO | — | ranked advisories |
| irrigation_plan | JSONB | YES | NULL | |
| fertilizer_plan | JSONB | YES | NULL | |
| pest_alert | JSONB | YES | NULL | |
| timeline_7_days | JSONB | YES | NULL | `DayAdvisory[]` |
| generated_at | TIMESTAMPTZ | NO | now() | |
| model_version | VARCHAR(30) | YES | NULL | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_ai_advisories_user_id`, `idx_ai_advisories_crop_id`, `idx_ai_advisories_generated_at` (BRIN for range scans), GIN `idx_ai_advisories_input` (input_snapshot). **Frontend:** `/crop/advisory`, dashboard advisory module.

### 7.3 `prediction_history`
**Purpose:** Unified activity feed for `/users/me/history` (`PredictionHistoryRecord`): advisories, disease detections, spoilage risks, yield forecasts — each row references source module row.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | NO | — | FK → `users.id` |
| prediction_type | VARCHAR(30) | NO | — | `Crop Advisory | Disease Detection | Spoilage Risk | Yield Forecast` |
| source_table | VARCHAR(50) | NO | — | `ai_advisories | disease_detections | post_harvest_analyses…` |
| source_id | BIGINT | NO | — | polymorphic source row |
| crop_id | BIGINT | YES | NULL | FK → `crops.id` |
| prediction | VARCHAR(255) | NO | — | headline |
| disease_id | BIGINT | YES | NULL | FK → `diseases.id` |
| recommendation | TEXT | YES | NULL | |
| confidence | VARCHAR(10) | NO | — | `High | Medium | Low` |
| location | VARCHAR(255) | YES | NULL | `Ludhiana, PB (141001)` |
| status | VARCHAR(20) | NO | `Active` | `Active | Archived` |
| report_id | BIGINT | YES | NULL | FK → `reports.id` (downloadUrl) |
| occurred_at | TIMESTAMPTZ | NO | now() | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_prediction_history_user_status` (user_id, status), `idx_prediction_history_type`, `idx_prediction_history_occurred_at`, GIN trigram `idx_prediction_history_prediction`. **Frontend:** prediction-history-module, `/users/me/history`.

### 7.4 `chat_history`
**Purpose:** Future AI agri-assistant chat (per user spec). Message log per conversation.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | NO | — | FK → `users.id` |
| conversation_id | UUID | NO | — | groups messages |
| role | VARCHAR(10) | NO | — | `user | assistant | system` |
| message | TEXT | NO | — | |
| metadata_json | JSONB | YES | NULL | citations, sources |
| created_at | TIMESTAMPTZ | NO | now() | append-only |

**Indexes:** `idx_chat_history_user_conversation` (user_id, conversation_id), `idx_chat_history_created_at`.

---

## 8. Soil Module

### 8.1 `soil_tests`
**Purpose:** Soil test reports submitted by farmers or labs (NPK, pH, EC, organic carbon) per field.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | NO | — | FK → `users.id` |
| field_id | BIGINT | YES | NULL | FK → `farmer_fields.id` |
| lab_name | VARCHAR(150) | YES | NULL | |
| report_date | DATE | NO | now() | |
| ph | NUMERIC(4,2) | YES | NULL | |
| ec | NUMERIC(6,3) | YES | NULL | |
| nitrogen_kg_ha | NUMERIC(8,2) | YES | NULL | |
| phosphorus_kg_ha | NUMERIC(8,2) | YES | NULL | |
| potassium_kg_ha | NUMERIC(8,2) | YES | NULL | |
| organic_carbon_pct | NUMERIC(5,2) | YES | NULL | |
| report_file_id | BIGINT | YES | NULL | FK → `uploaded_files.id` |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_soil_tests_user_id`, `idx_soil_tests_field_id`, `idx_soil_tests_report_date`.

### 8.2 `soil_history`
**Purpose:** Chronological soil-parameter trend per field (derived/aggregated from tests) for fertilizer recommendations and dashboards.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| field_id | BIGINT | NO | — | FK → `farmer_fields.id` |
| soil_test_id | BIGINT | YES | NULL | FK → `soil_tests.id` |
| sampled_on | DATE | NO | — | |
| parameters_json | JSONB | NO | — | latest test values snapshot |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_soil_history_field_date` (field_id, sampled_on), `idx_soil_history_soil_test_id`.

---

## 9. Weather Module

> High-write volume (hourly per station/region). Design: append-only core + upsert cache. Partitionable by month (see §Scalability).

### 9.1 `weather_cache`
**Purpose:** Latest observed weather per (station/region) — the `/weather/current` response. Upsert per station; one row per station.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| station_id | BIGINT | YES | NULL | FK → `weather_stations.id` |
| location_key | VARCHAR(100) | NO | — | `pin-141001 | district-1 | lat,lng`; **UNIQUE** |
| temperature_c | NUMERIC(4,1) | NO | — | |
| feels_like_c | NUMERIC(4,1) | YES | NULL | |
| humidity_pct | SMALLINT | YES | NULL | |
| rainfall_mm | NUMERIC(6,2) | YES | NULL | |
| wind_speed_kmh | NUMERIC(6,2) | YES | NULL | |
| wind_direction | VARCHAR(10) | YES | NULL | |
| condition | VARCHAR(30) | NO | — | `Sunny | Partly Cloudy | Cloudy | Light Rain…` |
| uv_index | SMALLINT | YES | NULL | |
| air_quality_index | SMALLINT | YES | NULL | |
| observed_at | TIMESTAMPTZ | NO | — | |
| created_at / updated_at | TIMESTAMPTZ | — | — | no soft delete (cache) |

**Indexes:** `uq_weather_cache_location_key`, `idx_weather_cache_station_id`, `idx_weather_cache_observed_at`. **Frontend:** `/weather/current`, weather-insights-module.

### 9.2 `weather_forecasts`
**Purpose:** 7-day daily forecasts (`DailyForecast[]`) per location — millions of rows over time.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| location_key | VARCHAR(100) | NO | — | |
| station_id | BIGINT | YES | NULL | FK → `weather_stations.id` |
| forecast_date | DATE | NO | — | |
| day | VARCHAR(12) | YES | NULL | `Monday` (UI label) |
| temp_max_c | NUMERIC(4,1) | NO | — | |
| temp_min_c | NUMERIC(4,1) | NO | — | |
| condition | VARCHAR(30) | NO | — | |
| rainfall_probability_pct | SMALLINT | YES | NULL | |
| humidity_pct | SMALLINT | YES | NULL | |
| wind_speed_kmh | NUMERIC(6,2) | YES | NULL | |
| irrigation_needed | BOOLEAN | NO | false | |
| disease_risk | VARCHAR(10) | NO | `Low` | `Low | Medium | High` |
| provider | VARCHAR(30) | NO | `openweather` | |
| created_at / updated_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_weather_forecasts_location_date` (location_key, forecast_date) **UNIQUE** for upsert, `idx_weather_forecasts_date`. **Frontend:** `/weather/forecast`, weather-insights-module.

### 9.3 `weather_alerts`
**Purpose:** Generated alerts (heavy rain, heatwave, frost, wind) attributed to districts/farmers; feeds notification fan-out (WEATHER type).
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| alert_type | VARCHAR(30) | NO | — | `rain | heat | frost | wind | drought` |
| severity | VARCHAR(10) | NO | — | `Low | Moderate | High | Critical` |
| district_id | BIGINT | YES | NULL | FK → `districts.id` |
| title | VARCHAR(255) | NO | — | |
| message | TEXT | NO | — | |
| valid_from | TIMESTAMPTZ | NO | — | |
| valid_until | TIMESTAMPTZ | YES | NULL | |
| issued_by | BIGINT | YES | NULL | FK → `users.id` (admin) |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_weather_alerts_district_valid` (district_id, valid_until), `idx_weather_alerts_type_severity`.

---

## 10. Disease Detection Module

### 10.1 `disease_detections`
**Purpose:** Root record of every detection run (`DiseasePrediction`) — links to images, result, user.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| uuid | UUID | NO | gen_random_uuid() | public id; **UNIQUE** |
| user_id | BIGINT | YES | NULL | FK → `users.id` (null = anonymous) |
| crop_id | BIGINT | YES | NULL | FK → `crops.id` |
| disease_id | BIGINT | YES | NULL | FK → `diseases.id` (matched) |
| disease_name | VARCHAR(150) | NO | — | snapshot |
| scientific_name | VARCHAR(150) | YES | NULL | |
| confidence | VARCHAR(10) | NO | — | `High | Medium | Low` |
| confidence_score | NUMERIC(5,2) | NO | — | 0–100 |
| severity | VARCHAR(10) | NO | — | `Mild | Moderate | Severe` |
| treatment_snapshot | JSONB | YES | NULL | treatment block from KB |
| detected_at | TIMESTAMPTZ | NO | now() | |
| model_version | VARCHAR(30) | YES | NULL | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `uq_disease_detections_uuid`, `idx_disease_detections_user_id`, `idx_disease_detections_disease_id`, `idx_disease_detections_detected_at`. **Frontend:** `/disease/detect`, disease-detection-module.

### 10.2 `disease_images`
**Purpose:** One row per image per detection (original + thumbnail variants). Millions of images — files on object storage, metadata here.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| detection_id | BIGINT | NO | — | FK → `disease_detections.id` (cascade delete) |
| file_id | BIGINT | NO | — | FK → `uploaded_files.id` |
| is_primary | BOOLEAN | NO | true | |
| width / height | SMALLINT | YES | NULL | |
| size_bytes | BIGINT | NO | — | |
| created_at | TIMESTAMPTZ | NO | now() | |

**Indexes:** `idx_disease_images_detection_id`, `idx_disease_images_file_id`.

### 10.3 `disease_history`
**Purpose:** Longitudinal per-field/per-crop disease history with treatment outcome (did the recommendation work?) — retrains models, powers recurring-risk alerts.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| detection_id | BIGINT | NO | — | FK → `disease_detections.id` |
| user_id | BIGINT | NO | — | FK → `users.id` |
| field_id | BIGINT | YES | NULL | FK → `farmer_fields.id` |
| crop_id | BIGINT | YES | NULL | FK → `crops.id` |
| disease_id | BIGINT | YES | NULL | FK → `diseases.id` |
| resolved | BOOLEAN | YES | NULL | |
| treatment_applied | TEXT | YES | NULL | |
| outcome_notes | TEXT | YES | NULL | |
| recurrence_count | SMALLINT | NO | 0 | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_disease_history_user_id`, `idx_disease_history_field_disease` (field_id, disease_id), `idx_disease_history_crop_id`.

### 10.4 `treatment_recommendations`
**Purpose:** Admin-maintained KB augmenting `diseases` master — versioned treatment protocols per crop-disease-severity.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| disease_id | BIGINT | NO | — | FK → `diseases.id` |
| crop_id | BIGINT | YES | NULL | FK → `crops.id` (null = generic) |
| severity | VARCHAR(10) | NO | `Moderate` | |
| chemical_treatments | JSONB | YES | NULL | string[] |
| organic_treatments | JSONB | YES | NULL | string[] |
| recommended_product | VARCHAR(255) | YES | NULL | |
| dosage | VARCHAR(255) | YES | NULL | |
| is_active | BOOLEAN | NO | true | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_treatment_recommendations_disease_severity` (disease_id, severity).

---

## 11. Market Module

### 11.1 `market_prices`
**Purpose:** Daily APMC prices per crop per mandi (`MarketPriceItem`). Append-mostly, upsert per (mandi, crop, date). Millions of rows over time.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| mandi_id | BIGINT | NO | — | FK → `mandis.id` |
| crop_id | BIGINT | NO | — | FK → `crops.id` |
| price_date | DATE | NO | — | |
| min_price | NUMERIC(12,2) | NO | — | INR/quintal |
| max_price | NUMERIC(12,2) | NO | — | INR/quintal |
| todays_price | NUMERIC(12,2) | NO | — | modal price |
| change_pct | NUMERIC(5,2) | NO | 0 | vs previous day |
| trend | VARCHAR(10) | NO | `STABLE` | `UP | DOWN | STABLE` |
| unit | VARCHAR(20) | NO | `INR/Quintal` | |
| source | VARCHAR(30) | NO | `agmarknet` | |
| ingested_at | TIMESTAMPTZ | NO | now() | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** **UNIQUE** `uq_market_prices_mandi_crop_date` (mandi_id, crop_id, price_date) — upsert key; `idx_market_prices_crop_price_date` (crop_id, price_date) — trending query; `idx_market_prices_mandi_price_date`; GIN trigram on mandi/crop joins not needed (FKs). **Frontend:** `/market/prices`, `/market/trends`, live-mandi-prices page.

### 11.2 `price_predictions`
**Purpose:** Forecasted prices (`PricePoint[]` extrapolation) per crop/mandi/period; separate from observed data for model auditing.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| mandi_id | BIGINT | NO | — | FK → `mandis.id` |
| crop_id | BIGINT | NO | — | FK → `crops.id` |
| period | SMALLINT | NO | 7 | days horizon |
| predicted_prices | JSONB | NO | — | `PricePoint[]` |
| model_version | VARCHAR(30) | YES | NULL | |
| generated_at | TIMESTAMPTZ | NO | now() | |
| valid_until | TIMESTAMPTZ | NO | — | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_price_predictions_mandi_crop` (mandi_id, crop_id), `idx_price_predictions_valid_until`. **Frontend:** market-price-prediction-module.

### 11.3 `nearby_mandis`
**Purpose:** Cached distance/duration/price between a farmer location and mandis — powers `/services/nearby-mandi`, `/services/nearest-mandi`. Computed by jobs; stored to avoid repeated geocoding.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| origin_key | VARCHAR(100) | NO | — | pincode or `lat,lng` |
| mandi_id | BIGINT | NO | — | FK → `mandis.id` |
| distance_km | NUMERIC(8,2) | NO | — | |
| duration_hours | NUMERIC(6,2) | NO | — | |
| transport_cost_estimate | NUMERIC(12,2) | YES | NULL | |
| computed_at | TIMESTAMPTZ | NO | now() | |
| created_at / updated_at | TIMESTAMPTZ | — | — | |

**Indexes:** **UNIQUE** `uq_nearby_mandis_origin_mandi` (origin_key, mandi_id), `idx_nearby_mandis_origin_distance` (origin_key, distance_km).

---

## 12. Government Schemes Module

### 12.1 `scheme_applications`
**Purpose:** Farmer applications to schemes tracked end-to-end (draft → submitted → approved/rejected); references `farmer_documents`.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| uuid | UUID | NO | gen_random_uuid() | **UNIQUE** |
| user_id | BIGINT | NO | — | FK → `users.id` |
| scheme_id | BIGINT | NO | — | FK → `schemes.id` |
| status | VARCHAR(20) | NO | `draft` | `draft | submitted | under_review | approved | rejected` |
| submitted_at | TIMESTAMPTZ | YES | NULL | |
| documents_json | JSONB | YES | NULL | file_id + type list |
| remarks | TEXT | YES | NULL | |
| reviewed_by | BIGINT | YES | NULL | FK → `users.id` |
| decided_at | TIMESTAMPTZ | YES | NULL | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_scheme_applications_user_id`, `idx_scheme_applications_scheme_id`, `idx_scheme_applications_status`, `uq_scheme_applications_uuid`. **Frontend:** `/dashboard/schemes/[id]`.

---

## 13. Equipment Rental Module

### 13.1 `equipment_listings`
**Purpose:** Tractor/harvester listings from providers (`Equipment`): rates, availability, location.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| uuid | UUID | NO | gen_random_uuid() | **UNIQUE** |
| provider_id | BIGINT | NO | — | FK → `users.id` |
| name | VARCHAR(150) | NO | — | |
| equipment_type | VARCHAR(30) | NO | — | `tractor | harvester | other` |
| description | TEXT | YES | NULL | |
| hourly_rate | NUMERIC(10,2) | YES | NULL | INR |
| daily_rate | NUMERIC(10,2) | YES | NULL | INR |
| pincode | VARCHAR(6) | NO | — | |
| district_id | BIGINT | YES | NULL | FK → `districts.id` |
| lat / lng | NUMERIC(9,6) | YES | NULL | |
| is_available | BOOLEAN | NO | true | |
| image_file_id | BIGINT | YES | NULL | FK → `uploaded_files.id` |
| rating_avg | NUMERIC(3,2) | YES | NULL | 0–5 |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_equipment_listings_type_pincode` (equipment_type, pincode), `idx_equipment_listings_provider_id`, GIN trigram `idx_equipment_listings_name`. **Frontend:** `/services/tractor-rent`, `/services/harvester-rent`, `/equipment`.

### 13.2 `rental_bookings`
**Purpose:** Booking lifecycle for equipment (create, my-bookings, cancel).
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| uuid | UUID | NO | gen_random_uuid() | **UNIQUE** |
| user_id | BIGINT | NO | — | FK → `users.id` (renter) |
| equipment_id | BIGINT | NO | — | FK → `equipment_listings.id` |
| start_at | TIMESTAMPTZ | NO | — | |
| end_at | TIMESTAMPTZ | NO | — | |
| total_amount | NUMERIC(12,2) | NO | — | |
| status | VARCHAR(20) | NO | `pending` | `pending | confirmed | in_progress | completed | cancelled` |
| location | VARCHAR(255) | YES | NULL | |
| cancelled_at | TIMESTAMPTZ | YES | NULL | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_rental_bookings_user_id`, `idx_rental_bookings_equipment_start` (equipment_id, start_at), `idx_rental_bookings_status`.

---

## 14. Cold Storage Module

### 14.1 `cold_storages`
**Purpose:** Facility listings (`ColdStorageFacility`): capacity, location, rates — powers `/cold-storage` + `/storage-facilities`.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| uuid | UUID | NO | gen_random_uuid() | **UNIQUE** |
| owner_id | BIGINT | YES | NULL | FK → `users.id` |
| name | VARCHAR(150) | NO | — | |
| pincode | VARCHAR(6) | NO | — | |
| district_id | BIGINT | YES | NULL | FK → `districts.id` |
| lat / lng | NUMERIC(9,6) | YES | NULL | |
| capacity_tonnes | NUMERIC(10,2) | NO | — | |
| occupied_tonnes | NUMERIC(10,2) | NO | 0 | |
| temp_range_c | VARCHAR(30) | YES | NULL | |
| rate_per_tonne_month | NUMERIC(10,2) | YES | NULL | |
| is_active | BOOLEAN | NO | true | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_cold_storages_pincode`, `idx_cold_storages_district_id`, `idx_cold_storages_capacity`. **Frontend:** `/services/cold-storage`, `/services/storage-rent`.

### 14.2 `storage_bookings`
**Purpose:** Cold-storage space reservations (start/end, quantity, crop) — `/cold-storage/{id}/bookings`.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| uuid | UUID | NO | gen_random_uuid() | **UNIQUE** |
| user_id | BIGINT | NO | — | FK → `users.id` |
| cold_storage_id | BIGINT | NO | — | FK → `cold_storages.id` |
| crop_id | BIGINT | YES | NULL | FK → `crops.id` |
| quantity_kg | NUMERIC(12,2) | NO | — | |
| start_date | DATE | NO | — | |
| end_date | DATE | NO | — | |
| total_amount | NUMERIC(12,2) | YES | NULL | |
| status | VARCHAR(20) | NO | `pending` | `pending | active | completed | cancelled` |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_storage_bookings_user_id`, `idx_storage_bookings_cold_storage_date` (cold_storage_id, start_date), `idx_storage_bookings_status`.

---

## 15. Transportation Module

### 15.1 `transport_calculations`
**Purpose:** Audit log of every `/market/transport-cost` calculation (`TransportCalculationResult`) — rates matrix debugging + user history.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | YES | NULL | FK → `users.id` |
| origin | VARCHAR(255) | NO | — | |
| destination | VARCHAR(255) | NO | — | |
| quantity_kg | NUMERIC(12,2) | NO | — | |
| transport_type_id | BIGINT | YES | NULL | FK → `transport_vehicle_types.id` |
| distance_km | NUMERIC(8,2) | NO | — | |
| transport_cost | NUMERIC(12,2) | NO | — | |
| estimated_price_at_destination | NUMERIC(12,2) | NO | — | |
| gross_revenue | NUMERIC(12,2) | NO | — | |
| net_profit | NUMERIC(12,2) | NO | — | |
| profit_margin_pct | NUMERIC(5,2) | NO | — | |
| transit_hours | NUMERIC(6,2) | NO | — | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_transport_calculations_user_id`, `idx_transport_calculations_created_at`.

### 15.2 `transport_routes`
**Purpose:** Cached route data (distance/duration) between origin-destination pairs — avoids repeated external API calls.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| origin_key | VARCHAR(150) | NO | — | |
| destination_key | VARCHAR(150) | NO | — | |
| distance_km | NUMERIC(8,2) | NO | — | |
| duration_hours | NUMERIC(6,2) | NO | — | |
| route_geometry | JSONB | YES | NULL | polyline |
| provider | VARCHAR(30) | NO | `osrm` | |
| expires_at | TIMESTAMPTZ | NO | — | cache TTL 30 days |
| created_at / updated_at | TIMESTAMPTZ | — | — | |

**Indexes:** **UNIQUE** `uq_transport_routes_origin_destination` (origin_key, destination_key), `idx_transport_routes_expires_at`.

---

## 16. Post-Harvest (Spoilage Risk)

### 16.1 `post_harvest_analyses`
**Purpose:** `SpoilageRiskResult` (spoilage %, shelf life, SELL/STORE/TRANSPORT decision matrix) — feeds reports + history + notifications.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| uuid | UUID | NO | gen_random_uuid() | **UNIQUE** |
| user_id | BIGINT | NO | — | FK → `users.id` |
| crop_id | BIGINT | NO | — | FK → `crops.id` |
| quantity_kg | NUMERIC(12,2) | NO | — | |
| harvest_date | DATE | NO | — | |
| storage_condition | VARCHAR(40) | NO | — | `Ambient/Open | Cold Storage | Ventilated Warehouse | Silo/Airtight` |
| location | VARCHAR(255) | YES | NULL | |
| spoilage_risk_pct | NUMERIC(5,2) | NO | — | |
| risk_level | VARCHAR(10) | NO | — | `Low | Moderate | High | Critical` |
| shelf_life_days | SMALLINT | NO | — | |
| days_remaining | SMALLINT | NO | — | |
| storage_recommendation | TEXT | YES | NULL | |
| decisions_json | JSONB | NO | — | sell/store/transport `DecisionOption[]` |
| analyzed_at | TIMESTAMPTZ | NO | now() | |
| model_version | VARCHAR(30) | YES | NULL | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_post_harvest_analyses_user_id`, `idx_post_harvest_analyses_crop_id`, `idx_post_harvest_analyses_risk_level`. **Frontend:** `/post-harvest/analyze-risk`, dashboard post-harvest module.

---

## 17. Reports, Files & Dashboard

### 17.1 `reports`
**Purpose:** Generated report metadata (`ReportSummary`) — PDF/CSV rows; binary lives in storage, `download_url` points to `/reports/download/{id}`.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| uuid | UUID | NO | gen_random_uuid() | **UNIQUE** |
| user_id | BIGINT | NO | — | FK → `users.id` |
| title | VARCHAR(255) | NO | — | |
| category | VARCHAR(40) | NO | — | `Advisory | Disease Diagnosis | Market Intelligence | Post-Harvest Analysis` |
| file_format | VARCHAR(10) | NO | — | `PDF | CSV` |
| file_size_bytes | BIGINT | YES | NULL | |
| file_size_display | VARCHAR(20) | YES | NULL | `1.8 MB` |
| summary_text | TEXT | YES | NULL | |
| storage_path | VARCHAR(500) | NO | — | private storage path |
| source_ref | VARCHAR(100) | YES | NULL | e.g. `ai_advisories:123` |
| generated_at | TIMESTAMPTZ | NO | now() | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_reports_user_category` (user_id, category), `idx_reports_generated_at`, `uq_reports_uuid`. **Frontend:** reports-module, `/reports`.

### 17.2 `export_history`
**Purpose:** Audit of every report/data export (who, what, format, when) — compliance + usage analytics.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | NO | — | FK → `users.id` |
| report_id | BIGINT | YES | NULL | FK → `reports.id` |
| export_type | VARCHAR(40) | NO | — | `report | market_data | history` |
| format | VARCHAR(10) | NO | — | |
| row_count | INT | YES | NULL | |
| ip_address | INET | YES | NULL | |
| exported_at | TIMESTAMPTZ | NO | now() | |
| created_at | TIMESTAMPTZ | NO | now() | |

**Indexes:** `idx_export_history_user_id`, `idx_export_history_exported_at`.

### 17.3 `uploaded_files`
**Purpose:** Single registry for ALL uploaded files (avatar, disease images, documents, reports) with storage metadata and ownership.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| uuid | UUID | NO | gen_random_uuid() | **UNIQUE** |
| user_id | BIGINT | NO | — | FK → `users.id` (owner) |
| disk | VARCHAR(30) | NO | `local` | `local | s3 | supabase_storage` |
| path | VARCHAR(500) | NO | — | |
| original_name | VARCHAR(255) | NO | — | |
| mime_type | VARCHAR(100) | NO | — | |
| size_bytes | BIGINT | NO | — | |
| sha256_hash | VARCHAR(64) | YES | NULL | dedup/index |
| visibility | VARCHAR(20) | NO | `private` | `private | public` |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_uploaded_files_user_id`, `uq_uploaded_files_uuid`, `idx_uploaded_files_sha256_hash`.

### 17.4 `dashboard_analytics`
**Purpose:** Precomputed dashboard summaries (`DashboardSummary`: weather temp, current crop, advisories count, disease risk, market price, unread count) — populated by scheduled jobs, served by `/dashboard`.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | YES | NULL | FK → `users.id` (null = global snapshot) |
| snapshot_date | DATE | NO | — | |
| weather_temp_c | NUMERIC(4,1) | YES | NULL | |
| current_crop_id | BIGINT | YES | NULL | FK → `crops.id` |
| advisories_count | INT | NO | 0 | |
| disease_risk | VARCHAR(10) | YES | NULL | |
| market_price_wheat | NUMERIC(12,2) | YES | NULL | |
| unread_notifications_count | INT | NO | 0 | |
| analytics_json | JSONB | YES | NULL | future KPIs |
| created_at / updated_at | TIMESTAMPTZ | — | — | |

**Indexes:** **UNIQUE** `uq_dashboard_analytics_user_date` (user_id, snapshot_date), `idx_dashboard_analytics_date`. **Frontend:** dashboard analytics-module, recent-activity-module (feed from activity_logs + prediction_history).

---

## 18. Notifications & Settings

### 18.1 `notifications`
**Purpose:** Per-user notifications (`NotificationItem`: PRICE/DISEASE/WEATHER/ADVISORY) + read state + unread count.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| uuid | UUID | NO | gen_random_uuid() | **UNIQUE** |
| user_id | BIGINT | NO | — | FK → `users.id` |
| type | VARCHAR(20) | NO | — | `PRICE | DISEASE | WEATHER | ADVISORY` |
| title | VARCHAR(255) | NO | — | |
| message | TEXT | NO | — | |
| action_url | VARCHAR(255) | YES | NULL | deep link |
| source_ref | VARCHAR(100) | YES | NULL | e.g. `market_prices:12` |
| is_read | BOOLEAN | NO | false | |
| read_at | TIMESTAMPTZ | YES | NULL | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_notifications_user_read` (user_id, is_read, created_at DESC) — unread badge query, `idx_notifications_user_type`, `idx_notifications_created_at`. **Frontend:** notification-panel, notifications-module, `/notifications`.

### 18.2 `notification_settings`
**Purpose:** Per-user alert preferences (`AlertPreferences`: sms/whatsapp/price/disease/weather toggles + threshold). Kept separate from profile for atomic updates.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | NO | — | FK → `users.id`; **UNIQUE** (1:1) |
| sms_enabled | BOOLEAN | NO | true | |
| whatsapp_enabled | BOOLEAN | NO | true | |
| price_threshold_alerts | BOOLEAN | NO | true | |
| disease_alerts | BOOLEAN | NO | true | |
| weather_alerts | BOOLEAN | NO | true | |
| min_price_threshold_inr | NUMERIC(10,2) | NO | 2400 | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `uq_notification_settings_user_id`. **Frontend:** alert-settings form, `/notifications/settings`.

### 18.3 `user_settings`
**Purpose:** Generic per-user key-value settings (future features) — single extensible table.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | NO | — | FK → `users.id` |
| key | VARCHAR(50) | NO | — | |
| value_json | JSONB | NO | — | |
| updated_at | TIMESTAMPTZ | NO | now() | |
| created_at | TIMESTAMPTZ | NO | now() | |

**Indexes:** **UNIQUE** `uq_user_settings_user_key` (user_id, key).

### 18.4 `language_settings`
**Purpose:** Language preference history per user (en ↔ gu switch events) — supports rollout analytics.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | NO | — | FK → `users.id` |
| language | VARCHAR(10) | NO | `en` | |
| changed_at | TIMESTAMPTZ | NO | now() | |
| created_at | TIMESTAMPTZ | NO | now() | |

**Indexes:** `idx_language_settings_user_id`, `idx_language_settings_changed_at`. (Current value mirrored on `users.preferred_language`.)

### 18.5 `theme_settings`
**Purpose:** UI theme preference (`light`/`dark` from `themeStore`) — synced across devices.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | NO | — | FK → `users.id`; **UNIQUE** |
| theme | VARCHAR(10) | NO | `light` | `light | dark | system` |
| updated_at | TIMESTAMPTZ | NO | now() | |
| created_at | TIMESTAMPTZ | NO | now() | |

**Indexes:** `uq_theme_settings_user_id`. **Frontend:** theme-toggle, theme-provider.

### 18.6 `activity_logs`
**Purpose:** User-facing activity feed (recent-activity-module): advisories generated, detections run, bookings made — readable by the user.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | NO | — | FK → `users.id` |
| activity_type | VARCHAR(40) | NO | — | `advisory_generated | disease_detected | booking_created | report_generated` |
| title | VARCHAR(255) | NO | — | |
| description | TEXT | YES | NULL | |
| source_ref | VARCHAR(100) | YES | NULL | |
| performed_at | TIMESTAMPTZ | NO | now() | |
| created_at | TIMESTAMPTZ | NO | now() | |

**Indexes:** `idx_activity_logs_user_performed` (user_id, performed_at DESC), `idx_activity_logs_type`.

### 18.7 `audit_logs`
**Purpose:** Admin/internal security audit (who changed what) — NOT user-visible; append-only, non-deletable.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| actor_user_id | BIGINT | YES | NULL | FK → `users.id` |
| actor_role_code | VARCHAR(30) | YES | NULL | snapshot |
| action | VARCHAR(50) | NO | — | `create | update | delete | login | export | status_change` |
| entity_type | VARCHAR(60) | NO | — | |
| entity_id | BIGINT | NO | — | |
| old_values_json | JSONB | YES | NULL | diff |
| new_values_json | JSONB | YES | NULL | |
| ip_address | INET | YES | NULL | |
| user_agent | VARCHAR(255) | YES | NULL | |
| performed_at | TIMESTAMPTZ | NO | now() | |
| created_at | TIMESTAMPTZ | NO | now() | |

**Indexes:** `idx_audit_logs_entity` (entity_type, entity_id), `idx_audit_logs_actor`, `idx_audit_logs_performed_at`, `idx_audit_logs_action`. **Security:** `pg` TRIGGER or app-layer interceptor writes; no UPDATE/DELETE privileges granted.

---

## 19. Support & Content Module

### 19.1 `feedback`
**Purpose:** User feedback/ratings on features (star rating + text + module) — product analytics.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | NO | — | FK → `users.id` |
| module | VARCHAR(40) | YES | NULL | `advisory | disease | market | …` |
| rating | SMALLINT | YES | NULL | 1–5 (CHECK) |
| message | TEXT | YES | NULL | |
| status | VARCHAR(20) | NO | `new` | `new | reviewed | resolved` |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_feedback_user_id`, `idx_feedback_status`.

### 19.2 `contact_requests`
**Purpose:** Landing/contact page submissions (`contact.tsx` → toasts; needs backend) — routed to support team.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| name | VARCHAR(150) | NO | — | |
| email | VARCHAR(255) | NO | — | |
| phone | VARCHAR(10) | YES | NULL | |
| subject | VARCHAR(255) | YES | NULL | |
| message | TEXT | NO | — | |
| status | VARCHAR(20) | NO | `new` | `new | in_progress | resolved` |
| assigned_to | BIGINT | YES | NULL | FK → `users.id` |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_contact_requests_status`, `idx_contact_requests_email`.

### 19.3 `faqs`
**Purpose:** Landing FAQ catalog (`faqs.tsx`) — admin-managed content.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| category | VARCHAR(50) | YES | NULL | |
| question | VARCHAR(500) | NO | — | |
| answer | TEXT | NO | — | |
| question_gujarati | VARCHAR(500) | YES | NULL | |
| answer_gujarati | TEXT | YES | NULL | |
| display_order | SMALLINT | NO | 0 | |
| is_active | BOOLEAN | NO | true | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_faqs_category_active` (category, is_active).

### 19.4 `testimonials`
**Purpose:** Farmer success stories on landing (`testimonials.tsx`: name, location, text, rating) — admin-managed.
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | NO | — | PK |
| user_id | BIGINT | YES | NULL | FK → `users.id` (if attributed) |
| name | VARCHAR(150) | NO | — | |
| location | VARCHAR(150) | YES | NULL | |
| text | TEXT | NO | — | |
| rating | SMALLINT | NO | 5 | 1–5 |
| is_approved | BOOLEAN | NO | false | |
| display_order | SMALLINT | NO | 0 | |
| created_at / updated_at / deleted_at | TIMESTAMPTZ | — | — | |

**Indexes:** `idx_testimonials_approved` (is_approved).

---

## 20. Relationship Map (Summary)

| Relationship | Tables |
|---|---|
| **1:1** | users ↔ farmer_profiles · users ↔ alert/notification_settings · users ↔ theme_settings |
| **1:N (parent → child)** | users → farmer_fields, farmer_documents, farmer_crops, otps, notifications, activity_logs, reports, uploaded_files · regions → districts → talukas → villages · crops → crop_varieties, crop_calendar · diseases → treatment_recommendations · mandis → market_prices, nearby_mandis · disease_detections → disease_images (cascade) |
| **M:N (pivot)** | users ↔ roles (`user_role`) · roles ↔ permissions (`role_permission`) · users ↔ crops (`farmer_crops` + context cols) |
| **Polymorphic** | prediction_history.source_table/source_id · notifications.source_ref · activity_logs.source_ref → advisory/detection/booking/report rows |
| **Cascade rules** | `ON DELETE CASCADE`: user → farmer_profiles, otps, notifications, activity_logs, disease_images (via detection) · `ON DELETE RESTRICT`: districts→mandis, crops→market_prices, schemes→applications (history must survive) |
| **Soft-delete propagation** | Deleting a user sets `deleted_at` (never hard-delete); children keep rows with `user_id` for audit/analytics; reports/audit_logs remain untouched |

---

## 21. Index Strategy (Performance)

| Query Pattern | Index |
|---|---|
| Unread badge (`notifications` per user, read=0, newest first) | `(user_id, is_read, created_at DESC)` |
| Market trend (`prices` per crop+mango, date range) | `(crop_id, price_date)`, `(mandi_id, price_date)` + UNIQUE upsert `(mandi_id, crop_id, price_date)` |
| Weather upsert + 7-day read | UNIQUE `(location_key, forecast_date)` |
| Prediction history feed (user, newest first) | `(user_id, status, occurred_at DESC)` |
| Advisory history range scans | BRIN on `ai_advisories.generated_at` (huge append-only) |
| Search (`q` params) | GIN **trigram** indexes: `schemes.title`, `mandis.name`, `diseases.name`, `equipment_listings.name`, `prediction_history.prediction` |
| Location lookups (nearby mandis, facilities) | `(pincode)` + `(district_id)`; future PostGIS `ST_DWithin` on lat/lng |
| Reports per user | `(user_id, category)` |
| Scheme applications | `(user_id)`, `(status)`, `(scheme_id)` |
| Dashboard snapshot | UNIQUE `(user_id, snapshot_date)` |
| CSV import | Every master table has **UNIQUE `code`** → UPSERT by code; `pg_copy` + `ON CONFLICT (code)` = fast idempotent imports |
| Future analytics | BRIN on `market_prices.price_date`, `weather_forecasts.forecast_date`, `audit_logs.performed_at` |

---

## 22. Security Strategy

1. **Ownership:** every user-scoped query filters `WHERE user_id = auth_user.id` — enforced in Services layer + policy test. `uploaded_files`/`reports`/`farmer_documents` are private (`visibility = private`).
2. **RBAC:** `user_role` + `role_permission` gates Admin/Agronomist/Extension Worker endpoints (mirrors `lib/permissions`). Admin-only: schemes, testimonials, weather alerts, FAQ, audit views.
3. **Sensitive data:** OTP codes stored **hashed** (`code_hash`), passwords via bcrypt/argon2; never log phone+OTP pairs.
4. **Soft-delete strategy:** `deleted_at` on all user data; **hard-delete prohibition** for `audit_logs` (REVOKE UPDATE/DELETE at DB role level); hard delete only for orphaned file objects in storage after quarantine window.
5. **Audit:** `audit_logs` written on every status change, export, permission change, login — actor snapshot included.
6. **Files:** uploads validated (MIME + size ≤ 5MB images, ≤ 20MB docs), stored with generated names (never original path), served via signed URLs (`reports/download/{id}`).
7. **Row-level visibility:** Supabase RLS enabled on all tables in parallel with Laravel ownership checks (defense in depth).

---

## 23. Scalability Strategy (100k+ farmers, millions of rows)

1. **Partitioning (Postgres native):**
   - `market_prices` — RANGE partition by `price_date` (monthly), with BRIN on child tables.
   - `weather_forecasts` — RANGE partition by `forecast_date`.
   - `disease_images`, `notifications`, `audit_logs`, `prediction_history` — partition by `created_at` (monthly/quarterly) when volume demands.
   - Master tables (regions, crops, mandis…) stay small & unpartitioned.
2. **Denormalization strategy:** daily aggregation job writes rollups into `dashboard_analytics` + `market_prices` keeps `trend`/`change_pct` computed at write-time (no join-time aggregation).
3. **Read replicas (Supabase):** point read-heavy endpoints (`/market/prices`, `/weather/*`) at replicas; writes to primary.
4. **Caching:** Laravel cache (Redis in prod) for weather current (10 min TTL), market prices (30 min), master data (24 h), transport routes (30 days via `expires_at`).
5. **Files:** disease images → object storage (S3/Supabase Storage), never the DB; metadata only in `uploaded_files`.
6. **Write batching:** price/weather ingestion via queued jobs (bulk UPSERT, COPY for CSV).
7. **Connection pool:** Supabase transaction pooler (port 6543) already configured.
8. **Vacuum/analyze** on partitioned children + index bloat monitoring for append-heavy tables.

---

## 24. Future Expansion

- **Mobile app:** existing `users.uuid`, `uploaded_files`, notifications + FCM `device_tokens` table (add later).
- **Admin panel:** powered by RBAC + `audit_logs`, `feedback`, `contact_requests`, `testimonials` moderation.
- **AI models:** `model_version` columns everywhere predictions are stored → model A/B comparisons; `chat_history` for assistant; disease retraining uses `disease_history.outcome_notes`.
- **IoT/sensors:** `weather_stations` + `soil_history` extend naturally to device telemetry.
- **Multi-language:** `*_gujarati` columns + `language_settings`; Hindi/Marathi add columns, not tables.
- **Payments:** bookings carry `total_amount`; add `payments` + `invoices` tables without touching existing schema.
- **PostGIS:** replace `lat/lng NUMERIC` pairs with `GEOMETRY(Point,4326)` when location queries scale; master tables already carry coordinates.

---

## 25. Frontend Feature → Table Mapping (Traceability)

| Frontend page/module | Primary tables |
|---|---|
| Login / Register / Verify OTP / Forgot password | users, otps, personal_access_tokens |
| Profile & alert settings | farmer_profiles, notification_settings, user_settings, language_settings, theme_settings, uploaded_files |
| Dashboard summary | dashboard_analytics (+ weather_cache, notifications, ai_advisories) |
| Recent activity | activity_logs, prediction_history |
| Crop recommendation | crop_recommendations, farmer_crops, crops |
| Crop advisory + 7-day timeline | ai_advisories, crop_calendar, weather_forecasts |
| Irrigation planner | crop_calendar, weather_forecasts |
| Disease detection + upload | disease_detections, disease_images, diseases, treatment_recommendations, uploaded_files |
| Disease search | diseases |
| Live mandi prices | market_prices, mandis, crops |
| Market trends / price prediction | price_predictions, market_prices, price trend via market_prices |
| Nearby / nearest mandi | nearby_mandis, mandis |
| Transport cost calculator | transport_calculations, transport_routes, transport_vehicle_types |
| Post-harvest spoilage risk | post_harvest_analyses |
| Cold storage / storage rent | cold_storages, storage_bookings |
| Tractor / harvester rent | equipment_listings, rental_bookings |
| Schemes & subsidies | schemes, scheme_applications, farmer_documents |
| Reports + download + export | reports, export_history |
| Notifications panel | notifications, notification_settings, weather_alerts |
| Prediction history | prediction_history |
| Landing FAQ / testimonials / contact | faqs, testimonials, contact_requests, feedback |
| Gujarat regions/districts data | regions, districts, talukas, villages, crops, district_crop_map (via crops+farmer_crops or dedicated `district_crop_map`) |

> **Note on `district_crop_map`:** the frontend `DistrictCropMap` maps district → crop ids with confidence. This is modeled as a dedicated pivot table `district_crop_map (district_id, crop_id, data_confidence)` — add to the master set at migration time.

---

## 26. Final Table Count

| Category | Tables |
|---|---|
| Master/Reference | 12 |
| Auth & Access | 7 |
| Farmer | 6 |
| Crop Advisory & AI | 4 |
| Soil | 3 |
| Weather | 4 |
| Disease | 5 |
| Market | 4 |
| Schemes | 2 |
| Equipment | 2 |
| Cold Storage | 2 |
| Transportation | 2 |
| Post-Harvest | 1 |
| Reports & Files | 4 |
| Notifications & Settings | 7 |
| Support & Content | 4 |
| **Total** | **69** |

> All 69 tables live in ONE database (schema `public` on Supabase PostgreSQL). No separate databases.

---

*Design approved pending your review. On approval, this document becomes the migration blueprint (one migration per module group, seeders for master data from CSV).*
