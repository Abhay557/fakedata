# 🚀 Enhancement Plan: ML/DS-Ready `data.user()` & `data.users()`

> The entire `fakedata` package is now focused exclusively on the **data module** — generating realistic synthetic user profiles for machine learning, deep learning, data analysis, and data science workflows.

---

## 🎯 Implementation Roadmap

### Phase 1: Clean Up & Core Realism (v2.0.0) ✅ COMPLETE
- [x] **Remove** fun, anime, animals modules and their helper JSON files
- [x] **Update** `index.js`, `index.d.ts`, `__init__.py` to export data only
- [x] Weighted age distribution (not uniform random)
- [x] Education object with level, field, GPA, real university, graduation year, student debt
- [x] Financial profile with income correlated to age + education + employment
- [x] Enhanced employment (status, industry, experience, job satisfaction, work mode)
- [x] Demographics (ethnicity, nationality, language, relationship status)
- [x] Create `companies.json`, `universities.json`, `industries.json`, `job_titles.json`, `salary_ranges.json`, `job_categories.json`, `countries.json` datasets
- [x] Update TypeScript definitions with full type coverage

### Phase 2: Health & Social (v2.1.0)
- [ ] Health profile (BMI, smoking, exercise, insurance)
- [ ] Social/behavioral metrics (social media, screen time, shopping habits)
- [ ] Configurable missing data rate: `data.users(1000, { missing_rate: 0.05 })`
- [ ] Create `conditions.json` dataset

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

## ✅ Phase 1 Deliverables Summary

### New Fields Added (per user profile)

| Category | Fields | Correlation Engine |
|:---|:---|:---|
| **Demographics** | ethnicity, nationality, language (primary/secondary), relationshipStatus | Age-correlated relationship status |
| **Education** | level, field, institution (real), institutionCountry, gpa, graduationYear, studentDebt | Age → level eligibility, debt → level |
| **Employment** | status, company (real), companySize, industry, jobTitle (real), jobCategory, yearsExperience, workMode, workHoursPerWeek, jobSatisfaction | Age → status, education → experience |
| **Financial** | annualIncome, creditScore, savings, monthlyExpenses, debtToIncome, taxBracket, investmentStyle, homeOwnership | Age × education × employment → income → all financial fields |

### New Dataset Files Created

| File | Records | Source |
|:---|:---|:---|
| `companies.json` | 273 real companies | `newdata/company.json` |
| `universities.json` | 3,000 universities | `newdata/world_universities_and_domains.json` |
| `industries.json` | 75 industries | `newdata/company.json` |
| `job_titles.json` | 500 job titles | `newdata/Salary_Dataset.json` |
| `salary_ranges.json` | 11 role categories | `newdata/Salary_Dataset.json` |
| `job_categories.json` | 23 categories | `newdata/job_skills.json` |
| `countries.json` | 202 countries | `newdata/world_universities_and_domains.json` |

### Statistical Realism

**Age Distribution (weighted, not uniform):**
```
18-24:  18%  ← students, early career
25-34:  22%  ← peak workforce
35-44:  20%  ← mid-career
45-54:  17%  ← senior professionals  
55-64:  13%  ← pre-retirement
65+:    10%  ← retired
```

**Field-to-field correlations:**
- Age → eligible education levels, relationship status, investment style, home ownership
- Education level → GPA range, student debt, income multiplier
- Age + education → years of experience, employment status
- Employment status + education + age → annual income
- Income → credit score, savings, expenses, tax bracket, debt-to-income

### Breaking Changes from v1.x
- `age` is now a `number` (was `string`)
- `birthDate` format changed to `YYYY-MM-DD` (was `M/D/YYYY`)
- `address.country` is now random global (was hardcoded "United States Of America")
- `university` field removed from root → moved to `education.institution`
- `occupation` field removed → replaced by richer `employment` object
- `family_status` removed → replaced by `demographics.relationshipStatus`
- New root fields: `demographics`, `education`, `employment`, `financial`

---

> [!IMPORTANT]
> **Phase 1 is complete.** The package now generates statistically realistic, inter-correlated user profiles using real-world data from 22,770 salary entries, 10,224 universities, 274 companies, and 1,250 job postings.
