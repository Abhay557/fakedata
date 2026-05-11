# Contributing to fakedata

First off — thank you for taking the time to contribute!

**fakedata** is an open source project and every contribution helps, whether it's fixing a typo, reporting a bug, suggesting a feature, or writing code.

---

## Table of Contents

- [Getting Started](#getting-started)
- [How to Report a Bug](#how-to-report-a-bug)
- [How to Request a Feature](#how-to-request-a-feature)
- [How to Submit a Pull Request](#how-to-submit-a-pull-request)
- [Code Style Guidelines](#code-style-guidelines)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Code of Conduct](#code-of-conduct)

---

## Getting Started

### 1. Fork and Clone
```bash
git clone https://github.com/abhay557/fakedata.git
cd fakedata
```

### 2. Install Dependencies

**Node.js:**
```bash
npm install
```

**Python:**
```bash
pip install -e .
```

### 3. Run the tests to make sure everything works
```bash
# Node.js
node test.js

# Python
python test_py.py
```

---

## How to Report a Bug

Please use the **Bug Report** issue template. Before submitting, check if the bug has already been reported in the [Issues tab](https://github.com/abhay557/fakedata/issues).

A good bug report includes:
- What you were trying to do
- What you expected to happen
- What actually happened
- Your OS, Node.js/Python version, and package version

---

## How to Request a Feature

Please use the **Feature Request** issue template. Describe:
- The problem you are trying to solve
- Your proposed solution or idea
- Why it would be useful to other users

---

## How to Submit a Pull Request

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes.** Keep them focused — one PR per feature or fix.

3. **Test your changes** in both Node.js and Python if you touched shared logic.

4. **Commit with a clear message:**
   ```bash
   git commit -m "feat: add streaming API for large dataset generation"
   ```

5. **Push and open a PR** against the `main` branch. Fill in the PR template with a description of what you changed and why.

---

## Code Style Guidelines

### JavaScript / TypeScript
- Use `'use strict'` at the top of all JS files.
- Use `const` and `let` — no `var`.
- Keep functions short and focused.
- Add a comment if the logic is not immediately obvious.

### Python
- Follow [PEP 8](https://pep8.org/).
- Use `snake_case` for functions and variables.
- Keep Python and JS logic in **parity** — if you add a feature to one, add it to the other.

---

## Project Structure

```
fakedata/
├── src/
│   ├── index.js          # Node.js entry point
│   ├── cli.js            # Node.js CLI
│   └── modules/
│       └── data.js       # Core generation engine (JS)
├── fakedata/
│   ├── __init__.py
│   ├── cli.py            # Python CLI
│   └── modules/
│       └── data.py       # Core generation engine (Python)
├── helpers/              # JSON data files (names, jobs, devices, etc.)
├── tests/                # Test files
├── package.json
└── pyproject.toml
```

---

## Running Tests

```bash
# Node.js
node test.js

# Python
python test_py.py
```

Please make sure all tests pass before submitting a PR.

---

## Code of Conduct

By participating in this project, you agree to follow our [Code of Conduct](./CODE_OF_CONDUCT.md). Please be kind and respectful to everyone.

---

Thank you again for contributing! Even a small fix makes the project better for everyone. 🙏
