# @abhay557/fakedata

[![NPM Version](https://img.shields.io/npm/v/@abhay557/fakedata.svg)](https://www.npmjs.com/package/@abhay557/fakedata)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A high-performance, **zero-dependency** mock data generation engine designed for testing, prototyping, and local development. 

Whether you're building a frontend prototype, seeding a database with thousands of records, or developing complex data-driven tests, `@abhay557/fakedata` provides a structured, type-safe API for generating high-quality synthetic data across multiple domains.

---

##  Key Features

- **Zero External Dependencies**: Lightweight footprint with maximum security and speed.
- **Modular Architecture**: Separate namespaces for data, entertainment, anime, and biology.
- **Rich Datasets**: Bundled with comprehensive JSON assets (Pokemon, Users, Industry-standard resumes).
- **TypeScript Ready**: Full type definitions included out of the box for superior developer experience.
- **Fast Execution**: Optimized for generating large datasets with minimal overhead.

---

##  Installation

Install the package via NPM or Yarn:

```bash
npm install @abhay557/fakedata
```

---

##  Quick Start

```javascript
const { data, fun, anime } = require('@abhay557/fakedata');

// 1. Generate a comprehensive user profile
const userProfile = data.user();
console.log(`Identity: ${userProfile.fullName} | City: ${userProfile.city}`);

// 2. Fetch specialized entertainment data
const pokemon = fun.pokemon();
const randomJoke = fun.joke();

// 3. Filter specific anime content
const narutoQuotes = anime.quotesByShow('Naruto');
```

---

## API Documentation

###  Data Module (`fakedata.data`)
Focused on professional-grade mock data for PII and enterprise simulations.

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `user()` | `Object` | Generates a full profile (Personal Details, Address, Job, Bank Info). |
| `users(count)` | `Array` | Returns an array of `n` unique user profiles. |
| `creditcard()` | `Object` | Generates realistic credit card data (Number, Expiry, CVV). |
| `resume(count)` | `Array` | Mock professional resumes with skills, experience, and education. |
| `getPassword(len)`| `String` | Secure random password generator (default length: 8). |
| `getEmail()` | `String` | Randomly generated email address. |
| `getCity()` | `String` | Global city name. |

###  Fun (`fakedata.fun`)
Dynamic content for gaming and entertainment applications.

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `pokemon()` | `Object` | Returns a random Pokemon with full stats, types, and abilities. |
| `pokemonByType(t)`| `Array` | Filters Pokemon by specific type (e.g., 'Fire', 'Water'). |
| `joke()` | `Object` | Randomly selected joke across various categories. |
| `fact()` | `Object` | General knowledge facts for engagement. |
| `fortune()` | `Object` | Philosophical or funny fortune cookies. |

###  Anime Module (`fakedata.anime`)
Curated datasets for anime-themed projects.

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `quote()` | `Object` | Iconic quotes with character and show attribution. |
| `quotesByShow(s)` | `Array` | All available quotes from a specific anime title. |
| `fact()` | `Object` | Specialized trivia regarding anime history and trivia. |

###  Animals Module (`fakedata.animals`)
Simple biological data and interesting facts.

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `random()` | `Object` | Returns a random animal profile. |
| `dogFact()` | `Object` | Canine-specific trivia and biological facts. |
| `catFact()` | `Object` | Feline-specific trivia and statistics. |

---

##  Testing

To run the local test suite and verify functions:

```bash
npm test
```

---

##  Development & Contributions

Contributions are welcome! If you'd like to add new datasets or modules, please follow these steps:

1. Clone the repository.
2. Implement your changes in `src/modules/`.
3. Add relevant tests in `test.js`.
4. Submit a Pull Request describing your changes.

---

##  License

Distributed under the **ISC License**. See `LICENSE` for more information.

**Maintainer**: [abhay557](https://github.com/abhay557)
