# 🚀 Enhancement Plan: ML/DS-Ready `data.user()` & `data.users()`

> The entire `fakedata` package is now focused exclusively on the **data module** — generating realistic synthetic user profiles for machine learning, deep learning, data analysis, and data science workflows.

---

## Current State Analysis

Your current `user()` generates **26 fields** across 7 categories:

### ✅ What's Already Good
- Name generation (first, middle, last)
- Address with coordinates
- Bank/credit card info
- Occupation & department
- Hobbies & technology profile

### ⚠️ Critical Gaps for ML/Data Science

| Problem | Impact |
|:---|:---|
| Age is fully random (18-38 only) | No realistic age distribution |
| Country is hardcoded to "United States" | Can't train multi-country models |
| No income correlation with age/occupation | Unrealistic financial data |
| No ethnicity/race field | Missing for demographic analysis |
| No education level tied to occupation | Breaks career-path modeling |
| No time-series data (account creation, activity) | Useless for temporal analysis |
| No nullable/missing fields | Real data has gaps — yours doesn't |
| No social/behavioral metrics | Can't model user engagement |

---

## 📦 Proposed New Fields (by Category)

### 1. **Demographics & Identity** (High Priority)
```
ethnicity           → "Asian", "Hispanic", "Black", "White", "Mixed", etc.
nationality         → "American", "Indian", "Brazilian", etc.
language            → { primary: "English", secondary: "Spanish" }
religion            → "Hindu", "Christian", "Muslim", "Atheist", etc.
sexual_orientation  → "heterosexual", "homosexual", "bisexual", "prefer not to say"
disability_status   → "none", "visual", "hearing", "mobility", "cognitive"
```
> **ML Use**: Bias detection, fairness auditing, demographic segmentation

### 2. **Education** (High Priority)
```
education: {
    level            → "High School", "Associate's", "Bachelor's", "Master's", "PhD", "Dropout"
    field            → "Computer Science", "Medicine", "Arts", "Business", etc.
    institution      → "MIT", "Stanford", "State University", etc.
    gpa              → 2.1 - 4.0 (weighted by level)
    graduation_year  → correlated with age
    student_debt     → correlated with education level
}
```
> **ML Use**: Income prediction, career trajectory modeling

### 3. **Financial Profile** (High Priority)
```
financial: {
    annual_income    → correlated with age + education + occupation
    credit_score     → 300-850, correlated with income/age
    savings          → correlated with income and age
    monthly_expenses → correlated with income
    debt_to_income   → calculated ratio
    tax_bracket      → derived from income
    investment_style → "conservative", "moderate", "aggressive"
    home_ownership   → "rent", "own", "mortgage"
}
```
> **ML Use**: Credit risk modeling, financial segmentation, loan prediction

### 4. **Health & Biometrics** (Medium Priority)
```
health: {
    bmi                → calculated from height/weight
    chronic_conditions → ["diabetes", "hypertension", "none"]
    smoking_status     → "never", "former", "current"
    alcohol_use        → "none", "social", "moderate", "heavy"
    exercise_frequency → "sedentary", "light", "moderate", "active", "very active"
    insurance_type     → "private", "public", "none"
    mental_health      → "good", "fair", "poor"
    sleep_hours        → 4-10 (normally distributed around 7)
}
```
> **ML Use**: Healthcare cost prediction, insurance risk, wellness modeling

### 5. **Social & Behavioral** (Medium Priority)
```
social: {
    social_media_platforms → ["Instagram", "Twitter", "LinkedIn", "TikTok"]
    daily_screen_time      → 1-14 hours (correlated with age)
    online_shopping_freq   → "rarely", "monthly", "weekly", "daily"
    preferred_payment      → "credit card", "debit card", "UPI", "cash"
    political_leaning      → "left", "center-left", "center", "center-right", "right"
    news_source            → "social media", "TV", "newspaper", "podcast"
    relationship_status    → "single", "dating", "married", "divorced", "widowed"
}
```
> **ML Use**: Consumer behavior, recommendation systems, sentiment analysis

### 6. **Employment (Enhanced)** (High Priority)
```
employment: {
    status           → "employed", "self-employed", "unemployed", "retired", "student"
    company_size     → "startup", "small", "medium", "enterprise"
    years_experience → correlated with age - education completion
    remote_work      → "onsite", "hybrid", "remote"
    industry         → "Technology", "Healthcare", "Finance", "Retail", etc.
    job_satisfaction  → 1-10
    work_hours_week  → 20-60
}
```
> **ML Use**: Employee churn, job market analysis, salary prediction

### 7. **Digital Footprint** (Low Priority)
```
digital: {
    email_verified    → true/false (90% true)
    account_created   → ISO timestamp (past 1-8 years)
    last_login        → ISO timestamp (recent)
    login_frequency   → "daily", "weekly", "monthly", "dormant"
    two_factor_auth   → true/false
    browser           → "Chrome", "Firefox", "Safari", "Edge"
    os                → "Windows", "macOS", "Linux", "Android", "iOS"
}
```
> **ML Use**: Fraud detection, user segmentation, churn prediction

### 8. **Transportation & Lifestyle** (Low Priority)
```
transportation: {
    primary_vehicle    → "car", "motorcycle", "bicycle", "public transit", "none"
    commute_time_mins  → 5-120 (correlated with city size)
    has_drivers_license → true/false (correlated with age)
}
```

---

## 🧠 Statistical Realism Improvements

These are **critical** to making the data useful for ML. Without these, any model trained on your data will learn wrong distributions.

### Age Distribution (use weighted probability, not uniform random)
```
18-24:  18%    ← students, early career
25-34:  22%    ← peak workforce
35-44:  20%    ← mid-career
45-54:  17%    ← senior professionals  
55-64:  13%    ← pre-retirement
65+:    10%    ← retired
```

### Income ↔ Age ↔ Education Correlation
```
High School + Age 25 → $25,000-$45,000
Bachelor's  + Age 30 → $45,000-$85,000
Master's    + Age 35 → $70,000-$120,000
PhD         + Age 40 → $90,000-$160,000
```

### Introduce Configurable Null/Missing Values
```javascript
// Let users control data quality
data.users(1000, { missing_rate: 0.05 })  // 5% of fields randomly null
```

---

## 📁 New JSON Datasets Needed

| File | Content | Est. Size |
|:---|:---|:---|
| `universities.json` | 500+ real university names with country | ~15 KB |
| `companies.json` | 500+ company names with industry & size | ~20 KB |
| `countries.json` | 195 countries with GDP, continent, language | ~25 KB |
| `ethnicities.json` | Ethnicity labels with regional distribution | ~3 KB |
| `industries.json` | Industry names with avg salary ranges | ~5 KB |
| `conditions.json` | Medical conditions with age-prevalence rates | ~5 KB |
| `skills.json` | Technical & soft skills by industry | ~10 KB |

---

## 🗑️ Modules to Remove

The package is now **data-only**. The following modules and their associated files should be removed:

| Module | Files to Delete |
|:---|:---|
| `fun` | `src/modules/fun.js`, `fakedata/modules/fun.py` |
| `anime` | `src/modules/anime.js`, `fakedata/modules/anime.py` |
| `animals` | `src/modules/animals.js`, `fakedata/modules/animals.py` |

Also remove from:
- `src/index.js` — remove `fun`, `anime`, `animals` imports and exports
- `src/index.d.ts` — remove `fun`, `anime`, `animals` namespace type definitions
- `fakedata/__init__.py` — remove non-data module imports
- `fakedata/core.py` — remove non-data references
- `README.md` — remove all fun/anime/animals API documentation

### Helper JSON files to remove
```
animefact.json, animequote.json, joke.json, fortune.json,
pickup.json, quote.json, pokemon.json, animal.json,
catfact.json, dogfact.json, fact.json
```

---

## 🎯 Implementation Roadmap

### Phase 1: Clean Up & Core Realism (v2.0.0)
- [ ] **Remove** fun, anime, animals modules and their helper JSON files
- [ ] **Update** `index.js`, `index.d.ts`, `__init__.py` to export data only
- [ ] Weighted age distribution (not uniform random)
- [ ] Education object with level, field, GPA
- [ ] Financial profile with income correlated to age + education
- [ ] Enhanced employment (status, industry, experience)
- [ ] Create `countries.json` + `universities.json` + `industries.json` datasets
- [ ] Update README and TypeScript definitions

### Phase 2: Health & Social (v2.1.0)
- [ ] Health profile (BMI, smoking, exercise, insurance)
- [ ] Social/behavioral metrics
- [ ] Ethnicity, nationality, language
- [ ] Create `conditions.json` + `ethnicities.json` datasets

### Phase 3: ML Power Features (v2.2.0)
- [ ] Configurable missing data rate: `data.users(1000, { missing_rate: 0.05 })`
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

## 💡 Killer Feature Ideas

### 1. `data.dataset(n, format)` — Direct ML Export
```javascript
// Returns a flat array of objects ready for pandas/sklearn
const dataset = data.dataset(10000, 'csv');
// Outputs: id,age,income,education_level,credit_score,...
```

### 2. `data.users(n, { correlations: true })` — Realistic Correlations
Fields are statistically linked instead of independently random.

### 3. `data.users(n, { seed: 42 })` — Reproducible Data
Same seed = same dataset every time. Essential for ML experiment reproducibility.

### 4. `data.users(n, { locale: 'in' })` — Localized Profiles
Indian names, Indian cities, INR salaries, Indian phone numbers.

---

> [!IMPORTANT]
> **Recommended start**: Phase 1 — remove the old modules, add weighted age + correlated income + education. This alone transforms the package from a toy data generator into a serious ML tool.
