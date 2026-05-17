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
- **Streaming Generation**: Files are written one record at a time — constant RAM usage regardless of dataset size. Generate 10M+ rows without running out of memory.
- **Standalone Generators**: Generate modular, domain-specific data without full user profiles using `data.company()`, `data.job()`, `data.medicalRecord()`, `data.university()`, and `data.transaction()`.
- **Enriched High-Fidelity Data**: Powered by aggregated datasets, user profiles now include structured `health.medicalHistory` arrays, `employment.companyDetails` with revenue and net income, and `employment.skills` arrays correlated to real job titles.

---

##  Node.js / TypeScript Implementation

### Installation
```bash
npm install @abhay557/fakedata
```

### Quick Start
```javascript
const fakedata = require('@abhay557/fakedata');

// Generate deterministic users with a 5% missing data rate (null injection)
const users = fakedata.data.users(1000, { seed: 42, missing_rate: 0.05 });

// Export directly to CSV format
const csvString = fakedata.data.usersToCSV(1000, { seed: 42 });

// Time-series activity data
const ts = fakedata.userTimeSeries({ days: 30, eventsPerDay: 8 });
console.log(`Generated ${ts.activity.length} events for ${ts.user.fullName}`);
```

### Streaming API & Custom Correlations
Generate unlimited data directly to disk while keeping memory at O(1), and force mathematical relationships between fields using the Pearson Correlation API:

```javascript
const fs = require('fs');
const fakedata = require('@abhay557/fakedata');

// Create a stream that emits 1 million users as CSV
const stream = fakedata.data.generateStream(1000000, { 
    format: 'csv',
    correlations: [
        { fieldA: 'education.level', fieldB: 'financial.annualIncome', pearson_coeff: 0.85 },
        { fieldA: 'health.bmi', fieldB: 'health.bloodPressure.systolic', pearson_coeff: 0.60 }
    ]
});

// Pipe directly to file (constant RAM usage)
stream.pipe(fs.createWriteStream('1m_dataset.csv'));
```

---

##  Python Implementation

### Installation
```bash
pip install fakedata-python
```

### Quick Start
```python
import fakedata
import pandas as pd

# Generate 10,000 highly correlated users deterministically
users = fakedata.data.users(10000, {"seed": 42})

# Or export directly to a Pandas DataFrame
df = pd.DataFrame(fakedata.data.users_flat(10000, {"seed": 42}))
print(df.head())

# Create time-series activity data
ts = fakedata.data.user_time_series({"days": 30, "events_per_day": 8})
print(f"Generated {len(ts['activity'])} events for {ts['user']['fullName']}")
```

### Streaming API & Custom Correlations
Generate unlimited data lazily, keeping memory footprint at O(1), and force mathematical relationships between fields using the Pearson Correlation API:

```python
import fakedata

# Create a lazy generator that yields 1 million users
stream = fakedata.generate_stream(1000000, {
    "correlations": [
        {"fieldA": "education.level", "fieldB": "financial.annualIncome", "pearson_coeff": 0.85},
        {"fieldA": "health.bmi", "fieldB": "health.bloodPressure.systolic", "pearson_coeff": 0.60}
    ]
})

# Process users one by one without blowing up RAM
for user in stream:
    # write to DB, serialize to file, or process
    pass
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
| `-T`, `--type` | `users` | Type of data: `users` \| `companies` \| `jobs` \| `universities` \| `transactions` \| `medical_records` |
| `-n`, `--count` | `10` | Number of records to generate |
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

# Generate 500 standalone company profiles (v2.1)
fakedata generate --type companies -n 500 -o companies.json

# Generate 100,000 medical records directly to a file (v2.1)
fakedata generate -T medical_records -n 100000 -o hospitals.json

# Generate 500 deterministic Indian users
fakedata generate -n 500 -l in --seed 42 -o india.json

# Fraud detection dataset with 5% anomalies
fakedata generate -n 10000 -a 0.05 -f csv -o fraud_data.csv

# Generate 1 million rows without running out of memory (streaming)
fakedata generate -n 1000000 -f csv -o big_dataset.csv

# Preview a single user in the console
fakedata preview

# Time-series activity logs for 100 users
fakedata generate -n 100 --timeseries --days 60 -o activity.json
```

### Streaming Architecture

When writing to a file (`-o`), the CLI uses a **streaming write** strategy:

- The output file is **created first**, before any data is generated.
- Each user is generated **one at a time** and written immediately to disk.
- The generated object is then **discarded** — it is never held in a large array.
- **RAM usage stays constant** (O(1)) regardless of how many records you generate.
- A live progress counter is printed every 10,000 records for large jobs.

This means you can generate **tens of millions of rows** without hitting Node.js heap limits or Python memory errors.

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

### 3. v2.1 High-Fidelity Data Injections
Version 2.1 completely revamps the `user()` profile by injecting rich, deeply nested real-world data distributions for Employment, Health, and Education.

```json
{
  "employment": {
    "status": "employed",
    "jobTitle": "Data Scientist",
    "jobCategory": "Engineering",
    "skills": ["Python", "SQL", "Machine Learning", "PyTorch"],
    "companyDetails": {
      "country": "United States",
      "industry": "Technology",
      "yearFounded": 1998,
      "revenue": 182300000000,
      "netIncome": 46200000000
    }
  },
  "health": {
    "medicalHistory": [
      {
        "condition": "Hypertension",
        "hospital": "UCLA Medical Center",
        "admissionType": "Urgent",
        "billingAmount": 18560.50,
        "medication": "Lisinopril",
        "testResult": "Abnormal"
      }
    ]
  },
  "education": {
    "institution": "Massachusetts Institute of Technology",
    "institutionDomain": "mit.edu",
    "institutionState": "Massachusetts"
  }
}
```

### 4. Locale-Aware Name Generation
Supports 8 locales with culturally accurate first names, last names, and country/phone codes:
- `'in'`: Aarav Sharma, Priya Patel (+91, India)
- `'jp'`: Haruto Tanaka, Sakura Sato (+81, Japan)
- `'kr'`: Minjun Kim, Seo-yeon Park (+82, South Korea)
- `'de'`: Lukas Müller, Mia Schmidt (+49, Germany)
- `'br'`: Miguel Silva, Alice Santos (+55, Brazil)
- `'ar'`: Mohammed Al-Ahmed, Fatima Khalil (+966, Saudi Arabia)
- `'fr'`: Gabriel Martin, Emma Dubois (+33, France)
- `'en'`: James Smith, Mary Johnson (+1, United States)

### 5. Time-Series Activity Data
Generate chronological behavioral logs for users. Event types include `login`, `page_view`, `purchase`, `search`, `click`, `logout`, `api_call`, `upload`, `download`, and `comment`.

```javascript
const ts = data.userTimeSeries({ seed: 42, days: 30, eventsPerDay: 8 });
// ts.user → Full user profile
// ts.activity → [{ timestamp, type, page, duration, device, ip, success, amount?, query? }]
```

### 6. Anomaly Injection Engine (Fraud Detection)
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

### 7. The User Profile Schema (109 Correlated Fields)
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

---
