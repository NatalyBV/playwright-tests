# Playwright Automation Test Suite

This repository contains an automated end-to-end (E2E) testing framework built using **Playwright** and **TypeScript**.

## Tech Stack & Tools
* **Automation Framework:** Playwright (Web / API testing engine)
* **Language:** TypeScript
* **Execution Environment:** Node.js

## Repository Structure
* `tests/` — Core test scripts hosting E2E scenario suites.
* `playwright.config.ts` — Central configuration file.
* `package.json` — Manages dependencies, Node.js packages, and runtime automation scripts.

## Local Setup & Execution

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org) (v16 or higher) installed on your machine.

### 2. Installation
Clone this repository and install the required dependencies along with Playwright-supported browser binaries:
```bash
# Clone the repository
git clone https://github.com

# Navigate into the project folder
cd playwright-tests

# Install Node modules
npm install

# Install Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install
```

### 3. Running the Tests
You can execute the automated suites using the following standard terminal commands:

```bash
# Run all tests in headless mode (default)
npx playwright test

# Run tests with the visual UI Dashboard mode (Interactive mode)
npx playwright test --ui

# Run tests and open the auto-generated HTML Test Report
npx playwright show-report
```
