# fakedata (Python)

[![Python Version](https://img.shields.io/badge/python-3.7%2B-blue.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A high-performance, **zero-dependency** mock data generation engine ported to Python. Designed for testing, prototyping, and local development.

Whether you're building a backend prototype, seeding a database with thousands of records, or developing complex data-driven tests, `fakedata` provides a structured API for generating high-quality synthetic data across multiple domains.

---

##  Key Features

- **Zero External Dependencies**: Uses only Python standard libraries (`json`, `random`, `pathlib`).
- **Modular Architecture**: Separate namespaces for data, entertainment, anime, and biology.
- **Rich Datasets**: Bundled with comprehensive JSON assets (Pokemon, Users, Industry-standard resumes).
- **Type Hinting**: Built-in support for IDE intellisense.
- **Fast Execution**: Optimized for generating large datasets with minimal overhead.

---

##  Installation

Install the package locally:

```bash
pip install .
```

---

##  Quick Start

```python
import fakedata

# 1. Generate a comprehensive user profile
user_profile = fakedata.data.user()
print(f"Identity: {user_profile['fullName']} | City: {user_profile['address']['city']}")

# 2. Fetch specialized entertainment data
pokemon = fakedata.fun.pokemon()
random_joke = fakedata.fun.joke()

# 3. Filter specific anime content
naruto_quotes = fakedata.anime.quotes_by_show('Naruto')
```

---

## API Documentation

###  Data Module (`fakedata.data`)
Focused on professional-grade mock data for PII and enterprise simulations.

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `user()` | `dict` | Generates a full profile (Personal Details, Address, Job, Bank Info). |
| `users(count)` | `list` | Returns a list of `n` unique user profiles. |
| `creditcard()` | `dict` | Generates realistic credit card data (Number, Expiry, CVV). |
| `resume(count)` | `list` | Mock professional resumes with skills, experience, and education. |
| `get_password(len)`| `dict` | Secure random password generator (default length: 8). |
| `get_email()` | `dict` | Randomly generated email address. |
| `get_city()` | `dict` | Global city name. |

###  Fun (`fakedata.fun`)
Dynamic content for gaming and entertainment applications.

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `pokemon()` | `dict` | Returns a random Pokemon with full stats, types, and abilities. |
| `pokemon_by_type(t)`| `dict` | Filters Pokemon by specific type (e.g., 'Fire', 'Water'). |
| `joke()` | `dict` | Randomly selected joke across various categories. |
| `fact()` | `dict` | General knowledge facts for engagement. |
| `fortune()` | `dict` | Philosophical or funny fortune cookies. |

###  Anime Module (`fakedata.anime`)
Curated datasets for anime-themed projects.

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `quote()` | `dict` | Iconic quotes with character and show attribution. |
| `quotes_by_show(s)` | `dict` | All available quotes from a specific anime title. |
| `fact()` | `dict` | Specialized trivia regarding anime history and trivia. |

###  Animals Module (`fakedata.animals`)
Simple biological data and interesting facts.

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `random_animal()` | `dict` | Returns a random animal profile. |
| `dog_fact()` | `dict` | Canine-specific trivia and biological facts. |
| `cat_fact()` | `dict` | Feline-specific trivia and statistics. |

---

##  Testing

To run the local test suite:

```bash
python test_python.py
```

---

##  Development & Contributions

Contributions are welcome! If you'd like to add new datasets or modules, please follow these steps:

1. Clone the repository.
2. Implement your changes in `fakedata/modules/`.
3. Add relevant tests in `tests/`.
4. Submit a Pull Request.

---

##  License

Distributed under the **MIT License**. See `LICENSE` for more information.

**Maintainer**: [abhay557](https://github.com/abhay557)
