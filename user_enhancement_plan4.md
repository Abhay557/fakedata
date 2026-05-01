# 🚀 Enhancement Plan: ML/DS-Ready `data.user()` & `data.users()`

> The entire `fakedata` package is focused exclusively on the **data module** — generating realistic synthetic user profiles for machine learning, deep learning, data analysis, and data science workflows.

---

## 🎯 Implementation Roadmap

### Phase 1: Clean Up & Core Realism (v2.0.0) ✅ COMPLETE
- [x] Remove fun, anime, animals modules
- [x] Weighted age distribution (demographic brackets)
- [x] Education object with real universities, fields, GPA, student debt
- [x] Financial profile correlated to age + education + employment
- [x] Enhanced employment (real companies, industries, job titles, satisfaction)
- [x] Demographics (ethnicity, nationality, language, relationship status)
- [x] Create 7 compact dataset files from raw `newdata/`
- [x] Full TypeScript type definitions

### Phase 2: Health & Social (v2.1.0) ✅ COMPLETE
- [x] Health Profile — BMI, blood pressure, exercise, smoking, alcohol, sleep, diet, conditions, insurance, medications
- [x] Social & Behavioral Profile — social media, shopping, news, travel, pets
- [x] Configurable missing data rate: `data.users(1000, { missing_rate: 0.05 })`
- [x] All correlations: age→conditions, BMI→exercise, age→platforms, employment→spending

### Phase 3: ML Power Features (v2.2.0) ✅ COMPLETE
- [x] **Seed-based reproducibility**: `data.users(1000, { seed: 42 })` — identical output every run
- [x] **CSV export**: `data.usersToCSV(1000)` — 109 flat columns, ready for pandas/Excel
- [x] **JSON export**: `data.usersToJSON(1000)` — pretty-printed, parseable
- [x] **Flat export**: `data.usersFlat(1000)` — flat dicts for DataFrame conversion
- [x] **Digital Footprint**: 15 new fields — timestamps, user agent, sessions, 2FA, account status
- [x] **Seedable PRNG**: mulberry32 (JS), random.seed (Python) — all `Math.random()` → `rng()`

### Phase 4: Advanced (v3.0.0)
- [ ] Custom schema override: `data.users(100, { schema: { age: { min: 25, max: 40 } } })`
- [ ] Locale-aware generation (Indian names for IN, Japanese for JP)
- [ ] Time-series user activity data
- [ ] Anomaly injection for fraud detection training

---

## ✅ Phase 3 Deliverables Summary

### New: Digital Footprint (15 fields per user)

| Field | Type | Correlation |
|:---|:---|:---|
| accountCreatedAt | ISO timestamp | age < 25 → max 4yr ago; age > 40 → max 10yr |
| lastLoginAt | ISO timestamp | 0–30 days ago |
| lastPasswordChangeAt | ISO timestamp | 1–18 months ago |
| userAgent | string | 7 realistic templates with version injection |
| browser | string | Chrome, Firefox, Safari, Edge, Opera, Brave |
| os | string | Windows 11/10, macOS, Ubuntu, Fedora, iOS, Android |
| referrer | string | google, facebook, twitter, direct, email, etc. |
| avgSessionMinutes | number | age < 30 → ~25min; older → ~15min |
| sessionsPerWeek | number | age < 30 → ~12; age > 50 → ~4 |
| totalSessions | number | sessionsPerWeek × account age in weeks |
| twoFactorEnabled | boolean | 60% for < 35, 35% for older |
| preferredLanguage | string | Weighted toward 'en' |
| accountStatus | string | 67% active, rest inactive/suspended |
| verifiedEmail | boolean | 85% true |
| verifiedPhone | boolean | 60% true |

### New: Seed-Based Reproducibility

```javascript
// JavaScript — same seed = identical output
const batch1 = data.users(100, { seed: 42 });
const batch2 = data.users(100, { seed: 42 });
// batch1[0].firstName === batch2[0].firstName → true
// batch1[0].age === batch2[0].age → true

// Python
batch1 = data.users(100, {"seed": 42})
batch2 = data.users(100, {"seed": 42})
# batch1[0]["firstName"] == batch2[0]["firstName"] → True
```

**Implementation**: JS uses mulberry32 (fast 32-bit PRNG); Python uses `random.seed()`. All internal `Math.random()` calls replaced with seedable `rng()`.

### New: Export Functions

```javascript
// JavaScript
const csv = data.usersToCSV(1000);       // CSV string (109 columns)
const json = data.usersToJSON(1000);     // Pretty JSON string
const flat = data.usersFlat(1000);       // Array of flat objects

// Python
csv = data.users_to_csv(1000)            # CSV string
json_str = data.users_to_json(1000)      # JSON string
flat = data.users_flat(1000)             # List of flat dicts

# Direct to pandas DataFrame:
import pandas as pd
df = pd.DataFrame(data.users_flat(10000, {"seed": 42}))
```

### Full User Profile Schema (109 flat columns)

```
User {
  identity(9):       id, fullName, firstName, lastName, middleName, username, password, email, phone
  personal(6):       age, gender, birthDate, bloodGroup, height, weight
  network(3):        domain, ip, macaddress
  address(7):        street, city, state, country, countryCode, zipCode, coordinates(2)
  demographics(5):   ethnicity, nationality, language(2), relationshipStatus
  education(7):      level, field, institution, institutionCountry, gpa, graduationYear, studentDebt
  employment(10):    status, company, companySize, industry, jobTitle, jobCategory, yearsExperience, workMode, workHoursPerWeek, jobSatisfaction
  financial(8):      annualIncome, creditScore, savings, monthlyExpenses, debtToIncome, taxBracket, investmentStyle, homeOwnership
  health(16):        bmi, bmiCategory, bloodPressure(2), exerciseFrequency, smoking, alcohol, sleepHoursPerNight, sleepQuality, diet, medicalCondition, insuranceProvider, medications, lastCheckupMonthsAgo, hasDisability, mentalHealth, vaccination
  social(9):         socialMedia(3), shopping(3), newsSource, travelFrequency, volunteers, pet
  digitalFootprint(15): accountCreatedAt, lastLoginAt, lastPasswordChangeAt, userAgent, browser, os, referrer, avgSessionMinutes, sessionsPerWeek, totalSessions, twoFactorEnabled, preferredLanguage, accountStatus, verifiedEmail, verifiedPhone
  bank(5):           nameOnCard, cardNumber, cardType, cardExpiry, cardCvv
  lifestyle(5):      hobbies, technology_profile(devices, phone_preferences, interest)
}
```

> **109 columns total** when flattened, all inter-correlated across 13 domain categories.

---

> [!IMPORTANT]
> **Phases 1, 2, and 3 are complete.** The package now generates 109-column, ML-ready synthetic profiles with seed reproducibility, CSV/JSON export, and realistic digital footprint data.
