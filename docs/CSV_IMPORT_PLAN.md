# KrishiMitra — CSV Import Plan (Gujarat Master Data)

> **Phase:** 4.5 — Master Data Preparation (planning only; no import code written yet)
> **Stack:** Laravel 12 + Supabase PostgreSQL (`public` schema)
> **Scope:** 12 master/reference tables identified for population from CSV files.
> **Status:** Plan approved — import tooling (models/services/seeders) comes in a later phase.
> **Companion docs:** `docs/DATABASE_SCHEMA.md` (schema), `docs/API_CONTRACT.md` (endpoints)

---

## 1. Overview

All master/reference tables use **string `code` values as the natural business key**. CSVs must always reference parents by **code** (e.g. `district_code`), never by numeric `id`, because IDs are auto-generated and unstable across environments.

| # | Table | Populated from CSV | Foreign keys |
|---|-------|:---:|---|
| 1 | `regions` | Yes | — |
| 2 | `districts` | Yes | `region_id` → `regions` |
| 3 | `talukas` | Yes | `district_id` → `districts` |
| 4 | `villages` | Yes | `taluka_id` → `talukas` |
| 5 | `crops` | Yes | — |
| 6 | `crop_varieties` | Yes | `crop_id` → `crops` |
| 7 | `soil_types` | Yes | — |
| 8 | `diseases` | Yes | `crop_id` → `crops` (nullable) |
| 9 | `weather_stations` | Yes | `district_id` → `districts` (nullable) |
| 10 | `mandis` | Yes | `district_id` → `districts` (nullable, `RESTRICT`) |
| 11 | `transport_vehicle_types` | Yes | — |
| 12 | `schemes` | Yes | — |

**Data sources (Gujarat):** GRIS (Gujarat Revenue Information System), GSDMA/IMD district grid, AGMARKNET mandi lists, I-Khedut scheme catalog, Gujarat Agriculture Statistics. Counts: 33 districts, ~252 talukas, ~18,000 villages (verify against official releases before generating CSVs).

---

## 2. Import Order (dependency-safe)

```
 1. regions
 2. districts
 3. talukas
 4. villages
 5. crops
 6. crop_varieties
 7. soil_types
 8. diseases
 9. weather_stations
10. mandis
11. transport_vehicle_types
12. schemes
```

Rationale: every table is imported only after all tables it references via FK. Tables without FKs (`regions`, `crops`, `soil_types`, `transport_vehicle_types`, `schemes`) can be imported in any order. `diseases`, `weather_stations`, `mandis` have nullable FKs, so a row with a missing parent code is allowed only if the parent genuinely does not exist (log as warning).

---

## 3. CSV File Conventions

- **Location (proposed):** `backend/database/csv/<table>.csv` (UTF-8, LF line endings, header row required).
- **Header:** snake_case, matching DB column names. Parent references use `<parent>_code` (e.g. `district_code`).
- **Booleans:** `1`/`0` (or `true`/`false`).
- **Empty values:** empty string → `NULL` for nullable columns.
- **JSONB columns:** value is a JSON-encoded string, e.g. `["wilt","leaf spots"]`. Importer must `json_decode` before insert.
- **idempotency:** importer should upsert on the unique key (`code`, or composite) — rerunning the same CSV must not duplicate rows.
- **Required keys** below are enforced by DB unique constraints; CSV rows violating them abort the import of that file.

---

## 4. Per-Table Specification

### 1. `regions` — Regions

| Column | Type | Required | Notes |
|---|---|---|---|
| `code` | string(50) | Yes | **Unique key** (e.g. `GJ-NORTH`) |
| `name` | string(100) | Yes | |
| `name_gujarati` | string(100) | No | |
| `display_order` | smallint | No | default 0 |
| `is_active` | boolean | No | default 1 |

- **Unique key:** `code`
- **FK dependencies:** none
- **Gujarat seed:** 5 regions — Kutch, Saurashtra, North Gujarat, Central Gujarat, South Gujarat.

### 2. `districts` — Districts

| Column | Type | Required | Notes |
|---|---|---|---|
| `region_code` | string(50) | Yes | resolves `region_id` |
| `code` | string(50) | Yes | **Unique key** (e.g. `GJ-01`) |
| `name` | string(100) | Yes | |
| `name_gujarati` | string(100) | No | |
| `default_pincode` | string(6) | No | |
| `is_active` | boolean | No | default 1 |

- **Unique key:** `code`
- **FK dependencies:** `regions.code` (must be imported first)
- **Gujarat seed:** 33 districts.

### 3. `talukas` — Talukas

| Column | Type | Required | Notes |
|---|---|---|---|
| `district_code` | string(50) | Yes | resolves `district_id` |
| `code` | string(50) | Yes | **Unique key** (e.g. `GJ-01-001`) |
| `name` | string(100) | Yes | |
| `name_gujarati` | string(100) | No | |
| `default_pincode` | string(6) | No | |

- **Unique key:** `code`
- **FK dependencies:** `districts.code`
- **Gujarat seed:** ~252 talukas.

### 4. `villages` — Villages

| Column | Type | Required | Notes |
|---|---|---|---|
| `taluka_code` | string(50) | Yes | resolves `taluka_id` |
| `code` | string(50) | Yes | **Unique key** (e.g. `GJ-01-001-0001`) |
| `name` | string(150) | Yes | |
| `pincode` | string(6) | No | |
| `lat` | decimal(9,6) | No | |
| `lng` | decimal(9,6) | No | |

- **Unique key:** `code`
- **FK dependencies:** `talukas.code`
- **Gujarat seed:** ~18,000 villages. Largest file; import in batches.
- **Note:** villages are not explicitly listed in the Phase 4.5 task order but are a master table with the same import mechanics — included here for completeness.

### 5. `crops` — Crops

| Column | Type | Required | Notes |
|---|---|---|---|
| `code` | string(50) | Yes | **Unique key** (e.g. `COTTON`) |
| `name` | string(100) | Yes | |
| `name_gujarati` | string(100) | Yes | NOT NULL in schema |
| `category` | string(50) | No | CHECK: `traditional` / `high-value` / `controlled-environment` (default `traditional`) |
| `is_premium` | boolean | No | default 0 |
| `base_yield` | string(50) | No | free-text, e.g. `"12 qtl/acre"` |
| `avg_price_per_qtl` | decimal(10,2) | No | |
| `season` | string(30) | No | e.g. `kharif`, `rabi` |
| `sowing_period` | string(100) | No | |
| `crop_icon_url` | string(255) | No | |
| `is_active` | boolean | No | default 1 |

- **Unique key:** `code`
- **FK dependencies:** none
- **Gujarat seed:** cotton, groundnut, castor, paddy, wheat, bajra, sugarcane, cumin, fennel, isabgol, potato, onion, garlic, banana, mango (Kesar), etc.

### 6. `crop_varieties` — Crop Varieties

| Column | Type | Required | Notes |
|---|---|---|---|
| `crop_code` | string(50) | Yes | resolves `crop_id` |
| `name` | string(100) | Yes | |
| `is_disease_resistant` | boolean | No | default 0 |
| `avg_duration_days` | smallint | No | |

- **Unique key:** composite `(crop_id, name)` — CSV uniquely identified by `crop_code + name`
- **FK dependencies:** `crops.code`
- **Gujarat seed:** approved varieties (e.g. BT cotton, GTH-1 groundnut, GW-496 wheat).

### 7. `soil_types` — Soil Types

| Column | Type | Required | Notes |
|---|---|---|---|
| `code` | string(50) | Yes | **Unique key** (e.g. `BLACK`, `ALLUVIAL`) |
| `name` | string(100) | Yes | |
| `water_retention_desc` | text | No | |

- **Unique key:** `code`
- **FK dependencies:** none
- **Gujarat seed:** black (regur), alluvial, coastal/saline, laterite, sandy (desert) soils.

### 8. `diseases` — Disease Master

| Column | Type | Required | Notes |
|---|---|---|---|
| `crop_code` | string(50) | No | optional; resolves `crop_id` (nullable FK) |
| `code` | string(50) | Yes | **Unique key** |
| `name` | string(150) | Yes | |
| `scientific_name` | string(150) | No | |
| `severity_default` | string(10) | No | CHECK: `Mild` / `Moderate` / `Severe` (default `Moderate`) |
| `symptoms` | jsonb | No | JSON array of strings |
| `preventive_measures` | jsonb | No | JSON array of strings |
| `chemical_treatments` | jsonb | No | JSON array of strings |
| `organic_treatments` | jsonb | No | JSON array of strings |
| `recommended_product` | string(255) | No | |
| `dosage` | string(255) | No | |
| `image_url` | string(255) | No | |

- **Unique key:** `code`
- **FK dependencies:** `crops.code` (optional — a crop-agnostic disease can leave `crop_code` blank)
- **Gujarat seed:** cotton bollworm, leaf curl, wilt; groundnut rust; paddy blast; citrus canker; etc.

### 9. `weather_stations` — Weather Stations

| Column | Type | Required | Notes |
|---|---|---|---|
| `code` | string(50) | Yes | **Unique key** (e.g. `WS-GJ-AHMEDABAD`) |
| `name` | string(150) | Yes | |
| `district_code` | string(50) | No | optional; resolves `district_id` (nullable FK) |
| `lat` | decimal(9,6) | Yes | |
| `lng` | decimal(9,6) | Yes | |
| `provider` | string(50) | No | default `openweather` |

- **Unique key:** `code`
- **FK dependencies:** `districts.code` (optional)
- **Gujarat seed:** IMD district grid points / AWS stations per district.

### 10. `mandis` — Mandis (APMC)

| Column | Type | Required | Notes |
|---|---|---|---|
| `code` | string(50) | Yes | **Unique key** (e.g. `M-GJ-AMRELI`) |
| `name` | string(150) | Yes | |
| `state` | string(50) | Yes | `Gujarat` |
| `district_code` | string(50) | No | optional; resolves `district_id` (FK is `RESTRICT` on delete) |
| `pincode` | string(6) | No | |
| `lat` | decimal(9,6) | No | |
| `lng` | decimal(9,6) | No | |
| `apmc_id_external` | string(50) | No | external APMC/AGMARKNET id |
| `is_active` | boolean | No | default 1 |

- **Unique key:** `code`
- **FK dependencies:** `districts.code` (optional)
- **Gujarat seed:** ~150+ APMC mandis from AGMARKNET.

### 11. `transport_vehicle_types` — Vehicle Types

| Column | Type | Required | Notes |
|---|---|---|---|
| `code` | string(50) | Yes | **Unique key** (e.g. `PICKUP`, `TRUCK6`) |
| `name` | string(80) | Yes | |
| `min_capacity_kg` | integer | Yes | |
| `max_capacity_kg` | integer | Yes | |
| `rate_per_km_per_qtl` | decimal(6,3) | Yes | |
| `avg_speed_kmph` | smallint | No | default 45 |
| `is_active` | boolean | No | default 1 |

- **Unique key:** `code`
- **FK dependencies:** none
- **Gujarat seed:** pickup, mini-truck (6 qtl), truck (12 qtl), container (20 qtl).

### 12. `schemes` — Government Schemes

| Column | Type | Required | Notes |
|---|---|---|---|
| `code` | string(50) | Yes | **Unique key** (e.g. `PM-KISAN`) |
| `title` | string(255) | Yes | |
| `category` | string(80) | Yes | e.g. `subsidy`, `loan`, `insurance`, `training` |
| `description` | text | No | |
| `benefits` | jsonb | No | JSON array of strings |
| `eligibility_criteria` | jsonb | No | JSON array of strings |
| `documents_required` | jsonb | No | JSON array of strings |
| `state` | string(50) | No | `Gujarat` for state-level schemes |
| `deadline` | date | No | `YYYY-MM-DD` |
| `apply_url` | string(255) | No | |
| `official_link` | string(255) | No | |
| `is_active` | boolean | No | default 1 |

- **Unique key:** `code`
- **FK dependencies:** none
- **Gujarat seed:** PM-KISAN, KALIA (Odisha — exclude; Gujarat analogues), I-Khedut subsidy schemes, crop insurance (PMFBY), soil health card, PM-KUSUM, agricultural mechanization subsidies.

---

## 5. Validation Rules (to be enforced by the future importer)

1. **Referential integrity** — every `<parent>_code` in a CSV must exist in the parent table (except where the FK is nullable and the field is blank).
2. **Uniqueness** — upsert keyed on `code` (or the composite key); duplicates within one CSV file abort.
3. **Enums/CHECKs** — `crops.category` and `diseases.severity_default` must match allowed values; invalid values abort the row.
4. **Numbers** — `lat`/`lng` within `[-180, 180]`; `pincode` must be 6 digits; `deadline` must parse as date.
5. **JSONB** — invalid JSON in jsonb columns aborts the row.
6. **Batching** — `villages` (~18k rows) should import in batches (e.g. 500 rows/transaction) to avoid statement timeouts on Supabase.

## 6. Import Sequence Summary

| Step | CSV file | Depends on | Est. rows |
|---|---|---|---|
| 1 | `regions.csv` | — | 5 |
| 2 | `districts.csv` | regions | 33 |
| 3 | `talukas.csv` | districts | ~252 |
| 4 | `villages.csv` | talukas | ~18,000 |
| 5 | `crops.csv` | — | ~40 |
| 6 | `crop_varieties.csv` | crops | ~120 |
| 7 | `soil_types.csv` | — | ~6 |
| 8 | `diseases.csv` | crops (optional) | ~60 |
| 9 | `weather_stations.csv` | districts (optional) | ~40 |
| 10 | `mandis.csv` | districts (optional) | ~150 |
| 11 | `transport_vehicle_types.csv` | — | ~4 |
| 12 | `schemes.csv` | — | ~30 |

> Row estimates are indicative for Gujarat; final numbers come from the curated source CSVs.
