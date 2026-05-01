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

### Configuration Options
Pass an `options` dictionary/object to `data.user(options)` or `data.users(n, options)`:

```javascript
const options = {
    seed: 42,              // Number: Ensures identical generation output
    missing_rate: 0.05,    // Float (0-1): 5% chance of any leaf field being null
    locale: 'jp',          // String: 'en', 'in', 'jp', 'kr', 'de', 'br', 'ar', 'fr'
    anomaly_rate: 0.02,    // Float (0-1): 2% of users will have injected fraud anomalies
    
    // Schema Constraints
    schema: {
        age: { min: 25, max: 40 },
        gender: "female",
        employment: { status: "employed" },
        financial: { annualIncome: { min: 60000, max: 120000 } },
        address: { country: "Japan" }
    }
}
```

### Supported API Methods

| Method (JS) | Method (Python) | Description |
| :--- | :--- | :--- |
| `data.user(options?)` | `data.user(options=None)` | Generate a single complex user profile. |
| `data.users(n, options?)` | `data.users(n, options=None)` | Generate an array/list of `n` users. |
| `data.userTimeSeries(opts)` | `data.user_time_series(opts)`| Returns `{ user, activity }` containing chronological event logs. |
| `data.usersFlat(n, opts?)` | `data.users_flat(n, opts=None)`| Returns flat dicts/objects, perfect for DataFrame ingestion. |
| `data.usersToCSV(n, opts?)` | `data.users_to_csv(n, opts=None)`| Returns a fully formatted CSV string (109 columns). |
| `data.usersToJSON(n, opts?)`| `data.users_to_json(n, opts=None)`| Returns a pretty-printed JSON string. |

### The User Profile Schema (109 Correlated Fields)
Each generated user contains highly realistic, correlated data. For example, age determines education graduation year, which impacts employment salary, which impacts credit score, which impacts housing status and health/BMI metrics.

Domains included:
- **Identity & Personal**: Name, Age, Gender, DOB, Blood Group, Height, Weight.
- **Address & Network**: Full Street Address, Coordinates, IP, MAC Address.
- **Demographics & Education**: Ethnicity, Nationality, Languages, Degree, GPA, Student Debt.
- **Employment & Financial**: Job Title, Industry, Income, Credit Score, Savings, Debt-to-Income.
- **Health**: BMI, Blood Pressure, Exercise Frequency, Sleep, Diet, Medical Conditions.
- **Social & Digital**: Social Media Presence, Shopping Habits, Digital Footprint (Account age, Last login, User Agent, 2FA status).

### Anomaly Injection Engine
When `anomaly_rate` is > 0, `fakedata` injects ML-detectable fraud patterns into the dataset. Affected users receive a special `_anomaly` flag object indicating the fraud type:
- `income_spike`: Impossible salary multipliers.
- `credit_fraud`: High credit score with absurd debt-to-income.
- `geo_impossible`: Lat/Lng at `(0,0)` and IP `0.0.0.0`.
- `velocity_attack`: Tens of thousands of sessions logged immediately.
- `health_outlier`: Impossible BMI or Blood Pressure.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to add new datasets or modules:
1. Ensure changes are implemented in **both** `src/` (JS) and `fakedata/` (Python).
2. Maintain naming parity for methods and JSON keys.
3. Submit a Pull Request.

---

## License

This project is licensed under the MIT License.
