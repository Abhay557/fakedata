# 🚀 Enhancement Plan: ML/DS-Ready `data.user()` & `data.users()`

> The entire `fakedata` package is now focused exclusively on the **data module** — generating realistic synthetic user profiles for machine learning, deep learning, data analysis, and data science workflows.

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
- [x] **Health Profile** — BMI, blood pressure, exercise, smoking, alcohol, sleep, diet, medical conditions, insurance, medications, disability, mental health, vaccination
- [x] **Social & Behavioral Profile** — social media platforms + screen time, shopping habits + spending, news consumption, travel, volunteering, pets
- [x] **Configurable missing data rate**: `data.users(1000, { missing_rate: 0.05 })`
- [x] Create `healthcare.json` dataset (500 hospitals, 6 conditions, 5 insurance providers, 10 medications)
- [x] All correlations: age→conditions, BMI→exercise, age→platforms, employment→spending

### Phase 3: ML Power Features (v2.2.0)
- [ ] Seed-based reproducibility: `data.users(1000, { seed: 42 })`
- [ ] CSV/JSON export: `data.usersToCSV(1000)`
- [ ] Digital footprint & timestamps
- [ ] Inter-field correlations engine

### Phase 4: Advanced (v3.0.0)
- [ ] Custom schema override: `data.users(100, { schema: { age: { min: 25, max: 40 } } })`
- [ ] Locale-aware generation (Indian names for IN, Japanese for JP)
- [ ] Time-series user activity data
- [ ] Anomaly injection for fraud detection training

---

## ✅ Phase 2 Deliverables Summary

### New Fields Added (per user profile)

| Category | Fields | Correlation Engine |
|:---|:---|:---|
| **Health** | bmi, bmiCategory, bloodPressure (systolic/diastolic), exerciseFrequency, smoking, alcohol, sleepHoursPerNight, sleepQuality, diet, medicalCondition, insuranceProvider, medications[], lastCheckupMonthsAgo, hasDisability, mentalHealth, vaccination | BMI→bmiCategory, age→conditions (45% if >50, 10% if <35), age→blood pressure, BMI→exercise, age→Medicare |
| **Social** | socialMedia (platforms[], screenTimeHoursPerDay, preferredContent), shopping (frequency, preferredCategories[], monthlyOnlineSpending), newsSource, travelFrequency, volunteers, pet | age→platform count (3-6 young, 0-1 old), age→screen time, employment→spending, age→news source, age→content preference |

### New API: Missing Data for ML Training

```javascript
// JavaScript
const messy = data.users(1000, { missing_rate: 0.05 });
// 5% of leaf fields randomly set to null
// Protected fields (id, fullName, firstName, lastName, age, gender, email) are never null

// Python
messy = data.users(1000, {"missing_rate": 0.05})
```

### Statistical Correlations Added

```
Age > 50  →  45% chance of medical condition (Cancer, Hypertension, Arthritis, Diabetes, Obesity, Asthma)
Age > 50  →  Higher blood pressure (systolic ~135 vs ~120)
Age ≥ 65  →  70% chance of Medicare insurance
BMI ≥ 30  →  2x weight toward "sedentary" exercise
Age < 25  →  3-6 social platforms, 7.5h screen time
Age > 60  →  0-1 social platforms, 3h screen time
Age < 35  →  News from social media/podcasts
Age > 35  →  News from TV/newspapers
Employment = employed  →  Higher online shopping spend base ($3000 vs $800)
```

### Dataset Files Created

| File | Records | Source |
|:---|:---|:---|
| `healthcare.json` | 500 hospitals, 6 conditions, 5 insurers, 10 meds | `newdata/healthcare_dataset.json` (55,500 records) |

### Full User Profile Schema (Phase 1 + Phase 2)

```
User {
  identity:    id, fullName, firstName, lastName, middleName, username, password, email, phone
  personal:    age, gender, birthDate, bloodGroup, height, weight, domain
  network:     ip, macaddress
  address:     street, city, state, country, countryCode, zipCode, coordinates
  demographics: ethnicity, nationality, language{primary,secondary}, relationshipStatus
  education:   level, field, institution, institutionCountry, gpa, graduationYear, studentDebt
  employment:  status, company, companySize, industry, jobTitle, jobCategory, yearsExperience, workMode, workHoursPerWeek, jobSatisfaction
  financial:   annualIncome, creditScore, savings, monthlyExpenses, debtToIncome, taxBracket, investmentStyle, homeOwnership
  health:      bmi, bmiCategory, bloodPressure, exerciseFrequency, smoking, alcohol, sleepHoursPerNight, sleepQuality, diet, medicalCondition, insuranceProvider, medications, lastCheckupMonthsAgo, hasDisability, mentalHealth, vaccination
  social:      socialMedia{platforms,screenTime,content}, shopping{frequency,categories,spending}, newsSource, travelFrequency, volunteers, pet
  bank:        nameOnCard, cardNumber, cardType, cardExpiry, cardCvv
  lifestyle:   hobbies, technology_profile
}
```

> **~90+ fields per user profile**, all inter-correlated across 8 domain categories.

---

> [!IMPORTANT]
> **Phase 2 is complete.** The package now generates health and social/behavioral data from 55,500 real healthcare records, with BMI-aware exercise patterns, age-correlated medical conditions, and generational social media behavior.
