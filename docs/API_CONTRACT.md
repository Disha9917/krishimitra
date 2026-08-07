# Krishimitra Backend API Contract

> Derived from the frontend codebase (`frontend/constants/api.ts`, `frontend/services/**`, `frontend/types/**`, `frontend/hooks/**`).
> Base URL: `https://api.krishimitra.agri/v1` (configurable via `NEXT_PUBLIC_API_URL`)

## 0. Global Conventions

### Response Envelope
All endpoints return the `ApiResponse<T>` envelope (see `frontend/types/api.ts`):

```json
{
  "success": true,
  "message": "string",
  "data": { },
  "timestamp": "2026-08-04T10:00:00Z",
  "errorCode": "optional|string"
}
```

### Errors
```json
{
  "success": false,
  "message": "string",
  "data": null,
  "timestamp": "...",
  "errorCode": "VALIDATION_ERROR | UNAUTHORIZED | NOT_FOUND | RATE_LIMITED | ..."
}
```
- 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Validation, 500 Server.

### Authentication
- **Bearer token** (JWT / Laravel Sanctum) in `Authorization: Bearer <token>`.
- Login flow supports **two modes** (`LoginCredentials`): password-based OR OTP-based.
- Response of login/register returns `UserProfile` + token (`AuthState.token`).

### UserProfile shape (returned by `/auth/me` and login)
```json
{
  "id": "string",
  "fullName": "string",
  "phone": "string",
  "email": "string",
  "role": "Farmer | Extension Worker | Agronomist | Admin",
  "farmSizeAcres": 5.5,
  "primaryCrop": "Wheat",
  "pinCode": "141001",
  "state": "PB",
  "district": "Ludhiana",
  "village": "optional",
  "alertPreferences": {
    "smsEnabled": true, "whatsappEnabled": true,
    "priceThresholdAlerts": true, "diseaseAlerts": true, "weatherAlerts": true,
    "minPriceThresholdINR": 2400
  },
  "preferredLanguage": "en",
  "avatarUrl": "optional"
}
```

---

## 1. Authentication Module

| # | Method | Endpoint | Auth | Request Payload | Response Payload (`data`) |
|---|--------|----------|------|-----------------|---------------------------|
| 1 | POST | `/auth/register` | Public | `{ fullName, phone, pinCode, primaryCrop, role? }` | `{ token, user: UserProfile }` |
| 2 | POST | `/auth/login` | Public | `{ phoneOrEmail, password? , otp? }` | `{ token, user: UserProfile }` |
| 3 | POST | `/auth/verify-otp` | Public | `{ phoneOrEmail, otp }` | `{ token, user: UserProfile }` |
| 4 | POST | `/auth/logout` | Bearer | — | `null` (invalidates token) |
| 5 | GET | `/auth/me` | Bearer | — | `UserProfile` |
| 6 | PUT/PATCH | `/auth/me` | Bearer | `Partial<UserProfile>` (incl. `avatarUrl`, `alertPreferences`) | `UserProfile` |
| 7 | POST | `/auth/forgot-password` | Public | `{ phoneOrEmail }` | `{ message }` (sends OTP) |
| 8 | POST | `/auth/reset-password` | Public | `{ phoneOrEmail, otp, newPassword }` | `{ message }` |

Validation rules (from `frontend/lib/validators`): phone `^[6-9]\d{9}$`, pin code `^[1-9][0-9]{5}$`.

---

## 2. Farmer (User Profile) Module

| # | Method | Endpoint | Auth | Request Payload | Response Payload (`data`) |
|---|--------|----------|------|-----------------|---------------------------|
| 9 | GET | `/users/me/history` | Bearer | Query: `page`, `limit`, `predictionType?`, `status?`, `q?` (search) | Paginated `PredictionHistoryRecord[]` |
| 10 | POST | `/users/me/history/{id}/archive` | Bearer | — | `PredictionHistoryRecord` |
| 11 | GET | `/users/me/reports` | Bearer | Query: `page`, `limit`, `category?` | Paginated `ReportSummary[]` |
| 12 | POST | `/users/me/avatar` | Bearer | `multipart/form-data: file` (image, max 5MB) | `{ avatarUrl }` |

`PredictionHistoryRecord`:
```json
{ "id": "string", "date": "ISO", "crop": "string", "predictionType": "Crop Advisory|Disease Detection|Spoilage Risk|Yield Forecast",
  "prediction": "string", "disease?": "string", "recommendation": "string",
  "confidence": "High|Medium|Low", "location": "string", "status": "Active|Archived", "downloadUrl?": "string" }
```

---

## 3. Weather Module

| # | Method | Endpoint | Auth | Request Payload | Response Payload (`data`) |
|---|--------|----------|------|-----------------|---------------------------|
| 13 | GET | `/weather/current` | Optional | Query: `pinCode?`, `lat?`, `lng?` | `CurrentWeather` |
| 14 | GET | `/weather/forecast` | Optional | Query: `pinCode?`, `lat?`, `lng?`, `days=7` | `DailyForecast[]` (7 days) |

`CurrentWeather`: `{ temperature, feelsLike, humidity, rainfall, windSpeed, windDirection, weatherCondition, uvIndex, airQualityIndex, location, updatedAt }`

`DailyForecast`:
```json
{ "day": "string", "date": "ISO", "tempMax": 0, "tempMin": 0, "condition": "string",
  "rainfallProbability": 0, "humidity": 0, "windSpeed": 0, "irrigationNeeded": true, "diseaseRisk": "Low|Medium|High" }
```

---

## 4. Crop Advisory Module

| # | Method | Endpoint | Auth | Request Payload | Response Payload (`data`) |
|---|--------|----------|------|-----------------|---------------------------|
| 15 | POST | `/crop/advisory` | Bearer | `FarmerCropInput`: `{ district?, landSizeAcres?, season?, soilType?, sowingDate?, cropType?, pinCode?, weatherObservation?, leafImage?, gpsLocation? }` | `CropAdvisoryResult` |
| 16 | GET | `/crop/supported-crops` | Public | Query: `districtId?` | `Crop[]` |
| 17 | GET | `/crop/7-day-timeline` | Bearer | Query: `cropType?`, `pinCode?` | `DayAdvisory[]` (7 days) |
| 18 | GET | `/crops` | Public | Query: `season?`, `category?`, `q?` | `Crop[]` |
| 19 | GET | `/crops/{id}` | Public | — | `Crop` |
| 20 | GET | `/regions` | Public | — | `Region[]` (with `districts`) |
| 21 | GET | `/regions/{id}` | Public | — | `Region` |
| 22 | GET | `/districts/{id}/crops` | Public | — | `DistrictCropMap` |

`CropAdvisoryResult` (top 3 advisories + irrigation + fertilizer + pest alert + timeline):
```json
{ "cropName": "string", "district": "string", "farmerInput": {...},
  "recommendations": [ { "rank": 1, "cropName": "string", "confidence": "High", "confidenceScore": 94,
     "title": "string", "explanation": "string", "recommendedAction": "string", "expectedYieldImprovement": "string" } ],
  "top3Advisories": [ ... ],
  "timeline7Days": [ { "day": 1, "date": "ISO", "dayName": "string", "weatherCondition": "string",
     "temperature": "26°C", "rainfallProbability": 10, "irrigation": "string", "fertilizer": "string",
     "diseaseRisk": "Low|Medium|High", "notes": "string" } ],
  "irrigation": { "title": "string", "confidence": "string", "waterQuantity": "string", "frequency": "string", "method": "string", "explanation": "string", "recommendedAction": "string" },
  "fertilizer": { "title": "string", "npkRatio": "string", "dosagePerAcre": "string", "applicationTime": "string", "explanation": "string", "recommendedAction": "string" },
  "pestAlert": { "title": "string", "severity": "string", "pestOrDiseaseName": "string", "symptoms": ["string"], "explanation": "string", "recommendedAction": "string" },
  "generatedAt": "ISO" }
```

---

## 5. Disease Detection Module

| # | Method | Endpoint | Auth | Request Payload | Response Payload (`data`) |
|---|--------|----------|------|-----------------|---------------------------|
| 23 | POST | `/disease/detect` | Bearer | `multipart/form-data`: `image` (File), `cropName` (default "Wheat"), `location?` | `DiseasePrediction` |
| 24 | GET | `/disease/search` | Public | Query: `q` (disease name), `cropName?`, `page?`, `limit?` | Paginated `DiseasePrediction[]` (knowledge base) |

**File upload endpoint** (image): image validated client-side via `validateImageFile` (type + size), sent as multipart; server stores via storage disk and returns `imageUrl`.

`DiseasePrediction`:
```json
{ "id": "string", "cropName": "string", "diseaseName": "string", "scientificName": "string",
  "confidence": "High|Medium|Low", "confidenceScore": 94.6, "imageUrl": "string", "severity": "Mild|Moderate|Severe",
  "symptoms": ["string"], "preventiveMeasures": ["string"],
  "treatment": { "chemical": ["string"], "organic": ["string"], "recommendedProduct": "string", "dosage": "string" },
  "detectedAt": "ISO" }
```

---

## 6. Market Prices Module

| # | Method | Endpoint | Auth | Request Payload | Response Payload (`data`) |
|---|--------|----------|------|-----------------|---------------------------|
| 25 | GET | `/market/prices` | Public | Query: `cropName?`, `mandiName?`, `state?`, `q?`, `page?`, `limit?`, `sortBy=todaysPrice`, `sortDir=desc` | Paginated `MarketPriceItem[]` |
| 26 | GET | `/market/trends` | Public | Query: `cropName?`, `mandiName?`, `period=7|30` | `PricePoint[]` |
| 27 | POST | `/market/transport-cost` | Public | `TransportCalculationInput`: `{ origin, destination, quantityKg, transportType }` | `TransportCalculationResult` |

`MarketPriceItem`:
```json
{ "id": "string", "cropName": "string", "category": "string", "mandiName": "string", "state": "string",
  "todaysPrice": 2420, "unit": "INR/Quintal", "changePercentage": 2.5, "trend": "UP|DOWN|STABLE",
  "weeklyTrend": [ { "label": "string", "price": 0, "date": "ISO" } ],
  "monthlyTrend": [ ... ], "minPrice": 0, "maxPrice": 0, "updatedAt": "ISO" }
```

`TransportCalculationResult`:
```json
{ "origin": "string", "destination": "string", "quantityKg": 0, "transportType": "string", "distanceKm": 145,
  "transportCost": 0, "estimatedPriceAtDestination": 2520, "grossRevenue": 0, "netEstimatedProfit": 0,
  "profitMarginPercentage": 0, "estimatedTransitHours": 3 }
```

---

## 7. Post-Harvest Module

| # | Method | Endpoint | Auth | Request Payload | Response Payload (`data`) |
|---|--------|----------|------|-----------------|---------------------------|
| 28 | POST | `/post-harvest/analyze-risk` | Bearer | `PostHarvestInput`: `{ crop, quantityKg, harvestDate, storageCondition, location }` | `SpoilageRiskResult` |
| 29 | GET | `/storage-facilities` | Public | Query: `pinCode?`, `q?`, `page?`, `limit?` | Paginated facilities |
| 30 | POST | `/storage-facilities/{id}/bookings` | Bearer | `{ startDate, endDate, quantityKg, crop }` | `StorageBooking` |

`SpoilageRiskResult`:
```json
{ "crop": "string", "quantityKg": 0, "harvestDate": "ISO", "storageCondition": "string", "location": "string",
  "spoilageRiskPercentage": 38, "riskLevel": "Low|Moderate|High|Critical", "shelfLifeDays": 0, "daysRemaining": 0,
  "storageRecommendation": "string", "analyzedAt": "ISO",
  "decisions": { "sell": DecisionOption, "store": DecisionOption, "transport": DecisionOption } }
```
`DecisionOption`: `{ type: "SELL|STORE|TRANSPORT", title, expectedProfit, currency, reason, risk: "Low|Medium|High", netReturnPerKg, timeframe, recommended }`

---

## 8. Government Schemes Module

Frontend pages: `central-schemes`, `government-subsidies`.

| # | Method | Endpoint | Auth | Request Payload | Response Payload (`data`) |
|---|--------|----------|------|-----------------|---------------------------|
| 31 | GET | `/schemes` | Public | Query: `category?`, `state?`, `q?`, `page?`, `limit?` | Paginated `Scheme[]` |
| 32 | GET | `/schemes/{id}` | Public | — | `Scheme` |
| 33 | GET | `/schemes/{id}/eligibility` | Bearer | Query: `pinCode?`, `farmSizeAcres?`, `primaryCrop?` | `{ eligible: boolean, reasons: string[] }` |
| 34 | GET | `/subsidies` | Public | Query: `category?`, `q?`, `page?`, `limit?` | Paginated `Subsidy[]` |

`Scheme`: `{ id, title, category, description, benefits, eligibilityCriteria, documentsRequired, state, deadline?, applyUrl?, officialLink? }`

---

## 9. Equipment Rental Module

Frontend pages: `tractor-rent`, `harvester-rent`.

| # | Method | Endpoint | Auth | Request Payload | Response Payload (`data`) |
|---|--------|----------|------|-----------------|---------------------------|
| 35 | GET | `/equipment` | Public | Query: `type=tractor|harvester`, `pinCode?`, `q?`, `page?`, `limit?` | Paginated `Equipment[]` |
| 36 | GET | `/equipment/{id}` | Public | — | `Equipment` |
| 37 | POST | `/equipment/{id}/bookings` | Bearer | `{ startDate, endDate, location }` | `EquipmentBooking` |
| 38 | GET | `/equipment/bookings/me` | Bearer | Query: `status?`, `page?`, `limit?` | Paginated `EquipmentBooking[]` |
| 39 | POST | `/equipment/bookings/{id}/cancel` | Bearer | — | `EquipmentBooking` |

`Equipment`: `{ id, name, type: "Tractor|Harvester", description, hourlyRate, dailyRate, providerName, pinCode, district, availability, imageUrl?, rating? }`

---

## 10. Cold Storage Module

Frontend page: `cold-storage`, `storage-rent` (post-harvest storage).

| # | Method | Endpoint | Auth | Request Payload | Response Payload (`data`) |
|---|--------|----------|------|-----------------|---------------------------|
| 40 | GET | `/cold-storage` | Public | Query: `pinCode?`, `q?`, `capacity?`, `page?`, `limit?` | Paginated `ColdStorageFacility[]` |
| 41 | GET | `/cold-storage/{id}` | Public | — | `ColdStorageFacility` |
| 42 | POST | `/cold-storage/{id}/bookings` | Bearer | `{ startDate, endDate, quantityKg, crop }` | `StorageBooking` |
| 43 | GET | `/cold-storage/bookings/me` | Bearer | Query: `status?`, `page?`, `limit?` | Paginated `StorageBooking[]` |

---

## 11. Reports Module

| # | Method | Endpoint | Auth | Request Payload | Response Payload (`data`) |
|---|--------|----------|------|-----------------|---------------------------|
| 44 | POST | `/reports/generate` | Bearer | `{ type: "advisory|disease|post-harvest|market", refId, format: "PDF|CSV", includeWeather? }` | `ReportSummary` |
| 45 | GET | `/reports` | Bearer | Query: `category?`, `page?`, `limit?` | Paginated `ReportSummary[]` |
| 46 | GET | `/reports/download/{id}` | Bearer | — | `binary` (PDF/CSV file, `Content-Disposition: attachment`) |
| 47 | DELETE | `/reports/{id}` | Bearer | — | `{ message }` |

`ReportSummary`:
```json
{ "id": "string", "title": "string", "category": "Advisory|Disease Diagnosis|Market Intelligence|Post-Harvest Analysis",
  "dateGenerated": "ISO", "fileFormat": "PDF|CSV", "fileSize": "1.8 MB", "summaryText": "string", "downloadUrl": "string" }
```

---

## 12. Notifications Module

| # | Method | Endpoint | Auth | Request Payload | Response Payload (`data`) |
|---|--------|----------|------|-----------------|---------------------------|
| 48 | GET | `/notifications` | Bearer | Query: `type?`, `read?`, `page?`, `limit?` | Paginated `Notification[]` |
| 49 | GET | `/notifications/unread-count` | Bearer | — | `{ count }` |
| 50 | POST | `/notifications/mark-all-read` | Bearer | — | `{ updated }` |
| 51 | POST | `/notifications/{id}/read` | Bearer | — | `Notification` |
| 52 | GET | `/notifications/settings` | Bearer | — | `AlertPreferences` |
| 53 | PUT | `/notifications/settings` | Bearer | `AlertPreferences` | `AlertPreferences` |

`Notification`:
```json
{ "id": "string", "type": "PRICE|DISEASE|WEATHER|ADVISORY", "title": "string", "message": "string",
  "time": "ISO", "read": false, "actionUrl": "string" }
```
`AlertPreferences` (embedded in UserProfile): `{ smsEnabled, whatsappEnabled, priceThresholdAlerts, diseaseAlerts, weatherAlerts, minPriceThresholdINR }`

---

## 13. Endpoint Summary Matrix

| Module | Count | Methods Used |
|--------|-------|--------------|
| Authentication | 8 | POST ×7, GET ×1, PUT ×1 |
| Farmer/Profile | 4 | GET, POST, PUT |
| Weather | 2 | GET ×2 |
| Crop Advisory | 8 | POST ×1, GET ×7 |
| Disease Detection | 2 | POST ×1 (multipart upload), GET ×1 |
| Market Prices | 3 | GET ×2, POST ×1 |
| Post-Harvest | 3 | POST ×1, GET ×1, POST ×1 |
| Government Schemes | 4 | GET ×4 |
| Equipment Rental | 5 | GET ×2, POST ×3 |
| Cold Storage | 4 | GET ×2, POST ×2 |
| Reports | 4 | POST, GET ×2, DELETE |
| Notifications | 6 | GET ×3, POST ×2, PUT ×1 |
| **Total** | **53** | |

## 14. Cross-Cutting Requirements

- **File upload endpoints (2):** `/disease/detect` (multipart image), `/users/me/avatar` (multipart image).
- **Pagination endpoints:** history, reports, notifications, market prices, equipment, cold storage, schemes, subsidies, disease search — all use `page` + `limit`.
- **Search endpoints (`q`):** history, reports, notifications, market prices, equipment, cold storage, schemes, disease search.
- **Filtering:** by `predictionType`, `status`, `category`, `cropName`, `mandiName`, `state`, `type`, `capacity`, `read`, `pinCode`.
- **Third-party integrations required:** weather provider (OpenWeather/WeatherAPI), distance/direction API for transport cost, APMC/mandi price data feed, AI/ML model for disease detection, AI model for advisory generation.
- **Rate limiting:** auth endpoints (login/OTP) — 5 req/min per phone/email. Public lookups — 60 req/min per IP.
