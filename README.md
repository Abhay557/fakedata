# fakedata 

[![NPM Version](https://img.shields.io/npm/v/@abhay557/fakedata?color=red&label=npm)](https://www.npmjs.com/package/@abhay557/fakedata)
[![PyPI Version](https://img.shields.io/pypi/v/fakedata-python?color=blue&label=pypi)](https://pypi.org/project/fakedata-python/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/16N9x1YCOVVvIF8rl7IQxKRkK4en_g3Gi?usp=sharing)
[![PyPI Downloads](https://static.pepy.tech/personalized-badge/fakedata-python?period=total&units=INTERNATIONAL_SYSTEM&left_color=BLACK&right_color=GREEN&left_text=downloads)](https://pepy.tech/projects/fakedata-python)

A high-performance, **zero-dependency** synthetic data generation engine, available for both **Node.js** and **Python**. Designed specifically for machine learning, data science, and analytics workflows, providing 100% data parity across platforms.

## Overview

`fakedata` has been completely rebuilt from the ground up to serve as an **ML-ready synthetic data engine**. It generates deeply interconnected user profiles with **112 flat columns across 13 domains** (Health, Financial, Employment, Digital Footprint, etc.), making it the perfect tool for training models, benchmarking pipelines, or simulating realistic databases.

###  Machine Learning Power Features:
- **Behavioral Personas**: Orchestrate correlations through 6 distinct personas (e.g., Executive, Student, Tech Pro) to ensure realistic socio-economic patterns.
- **Seed Reproducibility**: Generate byte-for-byte identical datasets across runs (and languages!) using `seed`.
- **Schema Overrides**: Force specific distributions (e.g., age ranges, income brackets, genders) using `schema`.
- **Locale-Aware Generation**: Support for 8 culture-specific name sets and phone formats (`en`, `in`, `jp`, `kr`, `de`, `br`, `ar`, `fr`).
- **Missing Data Simulation**: Automatically inject realistic nulls using `missing_rate` to test your data imputation pipelines.
- **Anomaly Injection**: Inject fraud/outlier profiles (e.g., impossible geography, credit fraud, income spikes) using `anomaly_rate`.
- **Time-Series Data**: Generate chronological activity logs (logins, page views, purchases) per user for behavioral modeling.
- **Pipeline Ready**: Export directly to CSV, JSON, or Flat objects (perfect for `pandas.DataFrame`).
- **CLI Tool**: Generate and export datasets directly from your terminal — no scripting required.

---

##  Node.js / TypeScript Implementation

### Installation
```bash
npm install @abhay557/fakedata
```

### Quick Start
```javascript
const { data } = require('@abhay557/fakedata');

// Generate deterministic users with a 5% missing data rate (null injection)
const users = data.users(1000, { seed: 42, missing_rate: 0.05 });

// Export directly to CSV format
const csvString = data.usersToCSV(1000, { seed: 42 });

// Time-series activity data
const ts = data.userTimeSeries({ days: 30, eventsPerDay: 8 });
console.log(`Generated ${ts.activity.length} events for ${ts.user.fullName}`);
```

---

##  Python Implementation

### Installation
```bash
pip install fakedata-python
```

### Quick Start
```python
import fakedata.data as data
import pandas as pd

# Generate 10,000 highly correlated users deterministically
users = data.users(10000, {"seed": 42})

# Or export directly to a Pandas DataFrame
df = pd.DataFrame(data.users_flat(10000, {"seed": 42}))
print(df.head())

# Create time-series activity data
ts = data.user_time_series({"days": 30, "events_per_day": 8})
print(f"Generated {len(ts['activity'])} events for {ts['user']['fullName']}")
```

---

##  CLI — Command Line Interface

After installing, use `fakedata` directly from your terminal. No scripts needed!

### Node.js (global install)
```bash
npm install -g @abhay557/fakedata
```

### Python (global install)
```bash
pip install fakedata-python
```

### CLI Commands

| Command | Description |
|:---|:---|
| `fakedata generate` | Generate synthetic user data |
| `fakedata preview` | Print a single user profile to the console |
| `fakedata help` | Show all available options |

### CLI Options

| Flag | Default | Description |
|:---|:---|:---|
| `-n`, `--count` | `10` | Number of users to generate |
| `-f`, `--format` | `json` | Output format: `json` \| `csv` \| `flat` |
| `-o`, `--output` | stdout | Output file path |
| `-s`, `--seed` | none | Random seed for reproducibility |
| `-l`, `--locale` | `en` | Locale: `en` \| `in` \| `jp` \| `kr` \| `de` \| `br` \| `ar` \| `fr` |
| `-a`, `--anomaly-rate` | `0` | Fraction of anomalous users (0–1) |
| `-m`, `--missing-rate` | `0` | Fraction of null fields (0–1) |
| `-t`, `--timeseries` | — | Include time-series activity logs |
| `--days` | `30` | Days of activity for time-series |
| `--pretty` | — | Pretty-print JSON output |

### Examples

```bash
# Generate 1000 users and save as CSV
fakedata generate -n 1000 -f csv -o dataset.csv

# Generate 500 deterministic Indian users
fakedata generate -n 500 -l in --seed 42 -o india.json

# Fraud detection dataset with 5% anomalies
fakedata generate -n 10000 -a 0.05 -f csv -o fraud_data.csv

# Preview a single user in the console
fakedata preview

# Time-series activity logs for 100 users
fakedata generate -n 100 --timeseries --days 60 -o activity.json
```

---
### sample output - one user
```fakedata.data.user()``` 
```fakedata.data.user(n) // set n = 100```

```json
  "id": "4612",
  "fullName": "Damaris Carlo Ebervale",
  "firstName": "Damaris",
  "lastName": "Ebervale",
  "middleName": "Carlo",
  "age": 31,
  "gender": "non-binary",
  "email": "damaris.ebervale@liberomail.com",
  "phone": "+1 7469125114",
  "username": "damaris_4612",
  "password": "UQ!VZr0cLUD9",
  "birthDate": "1995-07-19",
  "bloodGroup": "+B",
  "height": 185,
  "weight": 60,
  "domain": "damarisebervale.vg",
  "ip": "48.50.80.113",
  "macaddress": "33:2F:39:EE:3B:1E",
  "address": {
    "street": "3623 Chateau Lane",
    "city": "Kilgore",
    "state": "Texas",
    "country": "Sierra Leone",
    "countryCode": "SL",
    "zipCode": 36434,
    "coordinates": {
      "latitude": "-68.324385",
      "longitude": "55.859967"
    }
  },
  "demographics": {
    "ethnicity": "Hispanic",
    "nationality": "South Korean",
    "language": {
      "primary": "Arabic",
      "secondary": "Turkish"
    },
    "relationshipStatus": "dating"
  },
  "education": {
    "level": "Bachelor's",
    "field": "Computer Science",
    "institution": "Agricultural University of Lublin",
    "institutionCountry": "Poland",
    "gpa": 2.79,
    "graduationYear": 2017,
    "studentDebt": 64117
  },
  "employment": {
    "status": "self-employed",
    "company": "China CITIC Bank",
    "companySize": "enterprise",
    "industry": "Banking",
    "jobTitle": "\"ORACLE DBA\"",
    "jobCategory": "Network Engineering",
    "yearsExperience": 10,
    "workMode": "onsite",
    "workHoursPerWeek": 36,
    "jobSatisfaction": 6
  },
  "financial": {
    "annualIncome": 21600,
    "creditScore": 464,
    "savings": 1680,
    "monthlyExpenses": 1309,
    "debtToIncome": 3.12,
    "taxBracket": "12%",
    "investmentStyle": "moderate",
    "homeOwnership": "own"
  },
  "health": {
    "bmi": 17.5,
    "bmiCategory": "underweight",
    "bloodPressure": {
      "systolic": 100,
      "diastolic": 82
    },
    "exerciseFrequency": "3-4 times/week",
    "smoking": "never",
    "alcohol": "never",
    "sleepHoursPerNight": 8.3,
    "sleepQuality": "poor",
    "diet": "mediterranean",
    "medicalCondition": "None",
    "insuranceProvider": "UnitedHealthcare",
    "medications": [
      "Lisinopril"
    ],
    "lastCheckupMonthsAgo": 11,
    "hasDisability": false,
    "mentalHealth": "poor",
    "vaccination": "partially vaccinated"
  },
  "social": {
    "socialMedia": {
      "platforms": [
        "Pinterest",
        "Twitter/X",
        "Reddit",
        "Instagram"
      ],
      "screenTimeHoursPerDay": 3.8,
      "preferredContent": "video"
    },
    "shopping": {
      "frequency": "weekly",
      "preferredCategories": [
        "toys & games",
        "books"
      ],
      "monthlyOnlineSpending": 175
    },
    "newsSource": "social media",
    "travelFrequency": "weekly",
    "volunteers": false,
    "pet": "multiple"
  },
  "digitalFootprint": {
    "accountCreatedAt": "2021-04-01T09:59:41.867116+00:00",
    "lastLoginAt": "2026-04-24T09:59:41.867116+00:00",
    "lastPasswordChangeAt": "2025-11-06T09:59:41.867116+00:00",
    "userAgent": "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/121.0.0.0 Mobile Safari/537.36",
    "browser": "Chrome",
    "os": "Windows 11",
    "referrer": "facebook.com",
    "avgSessionMinutes": 17.6,
    "sessionsPerWeek": 10,
    "totalSessions": 2666,
    "twoFactorEnabled": false,
    "preferredLanguage": "de",
    "accountStatus": "inactive",
    "verifiedEmail": false,
    "verifiedPhone": true
  },
  "bank": {
    "nameOnCard": "Damaris Carlo Ebervale",
    "cardNumber": "2289970210128357",
    "cardType": "Mastercard",
    "cardExpiry": "5/29",
    "cardCvv": "355"
  },
  "hobbies": [
    "Knitting",
    "Gardening",
    "LARPing"
  ],
  "technology_profile": {
    "devices": {
      "additional_devices": [
        "BlackBerry Bold 9790",
        "Nokia N9"
      ],
      "smartphone": "Sony Ericsson Xperia X10"
    },
    "phone_preferences": {
      "critical_features": [
        "security features",
        "reliability",
        "5G connectivity"
      ],
      "primary_uses": [
        "photography",
        "education",
        "organization"
      ]
    },
    "interest": [
      "Knitting",
      "Gardening",
      "LARPing"
    ]
  }
}

```
---

## Advanced Features Reference

Both Python and JS/TS expose the same underlying engine options.

### 1. Configuration Options
Pass an `options` dictionary/object to `data.user(options)` or `data.users(n, options)`:

```javascript
const options = {
    seed: 42,              // Number: Ensures deterministic, byte-for-byte identical output
    missing_rate: 0.05,    // Float (0-1): 5% chance of any leaf field being null
    locale: 'jp',          // String: 'en', 'in', 'jp', 'kr', 'de', 'br', 'ar', 'fr'
    anomaly_rate: 0.05,    // Float (0-1): 5% of users will have injected fraud anomalies
    days: 30,              // Number: Days of time-series activity to generate
    eventsPerDay: 8,       // Number: Average events per day for time-series logs
    
    // Schema Constraints (force specific data distributions)
    schema: {
        age: { min: 25, max: 40 },           // Can also use { exact: 30 }
        gender: "female",                    // "male", "female", or "non-binary"
        employment: { status: "employed" }, 
        education: { level: "Master's" },
        financial: { annualIncome: { min: 60000, max: 120000 } },
        health: { medicalCondition: "Diabetes" },
        address: { country: "Japan" },
        height: { min: 160, max: 180 },
        weight: { min: 50, max: 80 }
    }
}
```

### 2. Supported API Methods

| Method (JS) | Method (Python) | Description |
| :--- | :--- | :--- |
| `data.user(opts?)` | `data.user(opts=None)` | Generate a single complex user profile. |
| `data.users(n, opts?)` | `data.users(n, opts=None)` | Generate an array/list of `n` users. |
| `data.userTimeSeries(opts)` | `data.user_time_series(opts)`| Returns `{ user, activity }` containing chronological event logs. |
| `data.usersFlat(n, opts?)` | `data.users_flat(n, opts=None)`| Returns flat dicts/objects, perfect for `pandas.DataFrame` ingestion. |
| `data.usersToCSV(n, opts?)` | `data.users_to_csv(n, opts=None)`| Returns a fully formatted CSV string (112 columns). |
| `data.usersToJSON(n, opts?)`| `data.users_to_json(n, opts=None)`| Returns a pretty-printed JSON string. |

### 3. Behavioral Personas (Statistical Modeling)
To ensure the data is useful for **Clustering** and **Regression** analysis, `fakedata` uses a **Persona-driven engine**. Every user is assigned one of 6 personas that orchestrate their life outcomes:

- **Executive**: High income, high education (Master's/PhD), premium Apple devices, luxury lifestyle.
- **Tech Professional**: High income, high-end hardware, heavy social media use, remote work bias.
- **Student**: Low income, high student debt, budget/mid-range tech, high social media footprint.
- **Manual Laborer / Service Worker**: Budget-conscious, steady income, consistent employment patterns.
- **Freelancer**: Flexible work modes, variable income ranges, mid-range tech profile.

These personas ensure that an analyst looking at your synthetic data will find **statistically significant clusters** rather than just a uniform cloud of random values.

---

## Data Structure Highlights (112 Columns)

### 3. Locale-Aware Name Generation
Supports 8 locales with culturally accurate first names, last names, and country/phone codes:
- `'in'`: Aarav Sharma, Priya Patel (+91, India)
- `'jp'`: Haruto Tanaka, Sakura Sato (+81, Japan)
- `'kr'`: Minjun Kim, Seo-yeon Park (+82, South Korea)
- `'de'`: Lukas Müller, Mia Schmidt (+49, Germany)
- `'br'`: Miguel Silva, Alice Santos (+55, Brazil)
- `'ar'`: Mohammed Al-Ahmed, Fatima Khalil (+966, Saudi Arabia)
- `'fr'`: Gabriel Martin, Emma Dubois (+33, France)
- `'en'`: James Smith, Mary Johnson (+1, United States)

### 4. Time-Series Activity Data
Generate chronological behavioral logs for users. Event types include `login`, `page_view`, `purchase`, `search`, `click`, `logout`, `api_call`, `upload`, `download`, and `comment`.

```javascript
const ts = data.userTimeSeries({ seed: 42, days: 30, eventsPerDay: 8 });
// ts.user → Full user profile
// ts.activity → [{ timestamp, type, page, duration, device, ip, success, amount?, query? }]
```

### 5. Anomaly Injection Engine (Fraud Detection)
When `anomaly_rate` is > 0, `fakedata` injects ML-detectable fraud patterns into the dataset. Affected users receive a special `_anomaly` flag object indicating the fraud type.

| Anomaly Type | Effect |
|:---|:---|
| `income_spike` | Income multiplied 5-15x |
| `credit_fraud` | Credit score = 100-200 or 850-999, DTI = 10-60 |
| `session_anomaly` | Sessions/week = 200-700, avg session = 500-1500 min |
| `age_outlier` | Age = 1, 2, 3, 115, 120, or 130 |
| `geo_impossible` | Coordinates = (0,0), IP = 0.0.0.0 |
| `velocity_attack` | Total sessions = 50k-150k, last login = now |
| `data_mismatch` | Age=12 + employed + 30yr experience + $500k income |
| `health_outlier` | BMI = 8-9 or 75-80, BP = extreme values |

### 6. The User Profile Schema (109 Correlated Fields)
Each generated user contains highly realistic, correlated data. For example, age determines education graduation year, which impacts employment salary, which impacts credit score, which impacts housing status and health/BMI metrics.

```text
identity(9) → personal(6) → network(3) → address(7) → demographics(5)
→ education(7) → employment(10) → financial(8) → health(16)
→ social(9) → digitalFootprint(15) → bank(5) → lifestyle(9)
```

---

## License

Distributed under the **MIT License**. See `LICENSE` for more information.

**Maintainer**: [abhay557](https://github.com/abhay557)

- Project Commit History - `https://github.com/abhay557/random-api.xyz`
