# fakedata 

[![NPM Version](https://img.shields.io/npm/v/@abhay557/fakedata?color=red&label=npm)](https://www.npmjs.com/package/@abhay557/fakedata)
[![PyPI Version](https://img.shields.io/pypi/v/fakedata-python?color=blue&label=pypi)](https://pypi.org/project/fakedata-python/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A high-performance, **zero-dependency** synthetic data generation engine, available for both **Node.js** and **Python**. Designed specifically for machine learning, data science, and analytics workflows, providing 100% data parity across platforms.

## Overview

`fakedata` has been completely rebuilt from the ground up to serve as an **ML-ready synthetic data engine**. It generates deeply interconnected user profiles with **109 flat columns across 13 domains** (Health, Financial, Employment, Digital Footprint, etc.), making it the perfect tool for training models, benchmarking pipelines, or simulating realistic databases.

###  Machine Learning Power Features:
- **Seed Reproducibility**: Generate byte-for-byte identical datasets across runs (and languages!) using `seed`.
- **Schema Overrides**: Force specific distributions (e.g., age ranges, income brackets, genders) using `schema`.
- **Locale-Aware Generation**: Support for 8 culture-specific name sets and phone formats (`en`, `in`, `jp`, `kr`, `de`, `br`, `ar`, `fr`).
- **Missing Data Simulation**: Automatically inject realistic nulls using `missing_rate` to test your data imputation pipelines.
- **Anomaly Injection**: Inject fraud/outlier profiles (e.g., impossible geography, credit fraud, income spikes) using `anomaly_rate`.
- **Time-Series Data**: Generate chronological activity logs (logins, page views, purchases) per user for behavioral modeling.
- **Pipeline Ready**: Export directly to CSV, JSON, or Flat objects (perfect for `pandas.DataFrame`).

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
| `data.usersToCSV(n, opts?)` | `data.users_to_csv(n, opts=None)`| Returns a fully formatted CSV string (109 columns). |
| `data.usersToJSON(n, opts?)`| `data.users_to_json(n, opts=None)`| Returns a pretty-printed JSON string. |

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

## 🤝 Contributing

Contributions are welcome! If you'd like to add new datasets or modules:
1. Ensure changes are implemented in **both** `src/` (JS) and `fakedata/` (Python).
2. Maintain naming parity for methods and JSON keys.
3. Submit a Pull Request.

---

## License

Distributed under the **MIT License**. See `LICENSE` for more information.

**Maintainer**: [abhay557](https://github.com/abhay557)

- Project Commit History - `https://github.com/abhay557/random-api.xyz`