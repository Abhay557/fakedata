# fakedata 

[![NPM Version](https://img.shields.io/npm/v/@abhay557/fakedata?color=red&label=npm)](https://www.npmjs.com/package/@abhay557/fakedata)
[![PyPI Version](https://img.shields.io/pypi/v/fakedata-python?color=blue&label=pypi)](https://pypi.org/project/fakedata-python/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A high-performance, **zero-dependency** mock data generation engine, available for both **Node.js** and **Python**. Designed for testing, prototyping, and local development with 100% data parity across platforms.

---

##  Overview

`fakedata` is a unified utility library that provides a structured API for generating high-quality synthetic data. Whether you are working in JavaScript or Python, you get access to the same datasets, logic, and output formats.

### Core Modules:
- **Data**: Professional-grade PII, addresses, and enterprise resumes.
- **Fun**: Pokemon stats, jokes, facts, and fortune cookies.
- **Anime**: Curated quotes and trivia from iconic series.
- **Animals**: Biological facts and random animal profiles.

---

##  Python Implementation

### Installation
```bash
pip install fakedata-python
```

### Quick Start
```python
import fakedata

# Generate a random user profile
user = fakedata.data.user()
print(f"Name: {user['fullName']} | City: {user['address']['city']}")

# Fetch a random Pokemon
poke = fakedata.fun.pokemon()
print(f"Random Pokemon: {poke['name']} ({poke['Type 1']})")
```

---

##  Node.js Implementation

### Installation
```bash
npm install @abhay557/fakedata
```

### Quick Start
```javascript
const fakedata = require('@abhay557/fakedata');

// Generate a random user profile
const user = fakedata.data.user();
console.log(`Name: ${user.fullName} | City: ${user.address.city}`);

// Fetch a random Pokemon
const poke = fakedata.fun.pokemon();
console.log(`Random Pokemon: ${poke.name} (${poke['Type 1']})`);
```

---

##  API Reference (Cross-Platform)

| Namespace | Method | Description |
| :--- | :--- | :--- |
| `data` | `user()` | Full identity profile (Name, Address, Job, Bank). |
| `data` | `users(n)` | Returns an array of `n` unique user profiles. |
| `data` | `creditcard()` | Realistic credit card data (Number, Expiry, CVV). |
| `fun` | `pokemon()` | Random Pokemon with stats and types. |
| `fun` | `joke()` | Random joke across various categories. |
| `anime` | `quote()` | Iconic anime quotes with character attribution. |
| `anime` | `quotes_by_show(s)` | Filtered quotes from a specific show. |
| `animals` | `random_animal()` | Random animal profile and interesting facts. |

---

##  Why use fakedata?

1. **Zero Dependencies**: Pure implementation using native language features.
2. **Cross-Language Parity**: If you use the same seed/logic, you get the same data structures in both JS and Python.
3. **Optimized for Speed**: Datasets are pre-loaded or efficiently indexed for rapid generation of large datasets.
4. **Rich Datasets**: Bundled with comprehensive JSON assets, no internet connection required.

---

## Contributing

Contributions are welcome! If you'd like to add new datasets or modules:
1. Ensure changes are implemented in **both** `src/` (JS) and `fakedata/` (Python).
2. Maintain naming parity for methods and JSON keys.
3. Submit a Pull Request.

---

## License

Distributed under the **MIT License**. See `LICENSE` for more information.

**Maintainer**: [abhay557](https://github.com/abhay557)
