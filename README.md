# Playwright + Cucumber + TypeScript E2E Demo

[![Playwright E2E & API Tests](https://github.com/jonisf87/fwk-playwrightBack/actions/workflows/playwright.yml/badge.svg)](https://github.com/jonisf87/fwk-playwrightBack/actions/workflows/playwright.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.64-2EAD33?logo=playwright&logoColor=white)
![Cucumber](https://img.shields.io/badge/Cucumber.js-13-23D96C?logo=cucumber&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node-%E2%89%A522-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

Automated end-to-end and API tests for [demoqa.com](https://demoqa.com) using Playwright, Cucumber (Gherkin), TypeScript, and the Page Object Model (POM) pattern.

Flows covered:

- User registration (happy/negative paths, CAPTCHA/API fallback)
- User login (happy/negative paths)
- Parallel user simulation: two users running concurrently, one filling the practice form, the other shuffling the sortable grid
- API testing: books retrieval, token generation, authenticated requests

## Folder Structure

```text
tests/
  features/    # Gherkin .feature files (UI and API scenarios)
  steps/       # Cucumber step definitions
  pages/       # Page Object Model classes (UI flows)
  support/     # Custom World, hooks, shared context
  fixtures/    # Static assets (e.g. test-image.png for upload)
```

## Getting Started

Requirements: Node.js 22 or newer (CI runs on Node 24).

1. Install dependencies:

   ```sh
   npm install
   ```

2. Install Playwright browsers:

   ```sh
   npx playwright install --with-deps
   ```

3. Run all tests:

   ```sh
   npm test
   ```

4. Lint:

   ```sh
   npx eslint .
   ```

5. Generate Playwright code (optional):

   ```sh
   npx playwright codegen <url>
   ```

## Test Scenarios

### Registration

- Happy path: API registration, asserts `User Register Successfully.` in response.
- Negative path: invalid password — expects password validation error (UI or API fallback if CAPTCHA blocks UI).

### Login

- Happy path: login with stored credentials, asserts profile page visible.
- Negative path: invalid credentials, asserts error message.

### Parallel User Simulation

- User 1 fills and submits the practice form; asserts confirmation modal.
- User 2 shuffles the sortable grid; asserts order changed.
- Negative: User 1 submits with an invalid email; asserts validation error.

### API

- Retrieve all books: status 200, response contains list.
- Generate token: status 200, valid token returned.
- Authenticated request: status 200, user info matches.

## Password Validation Regex

```text
^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})$
```

## Credential Handling

Credentials are persisted to `tests/support/data.json` after registration for reuse in login scenarios.

- Locally: generated on first run; reused if file exists. Repeated runs treat `User exists` (406) as success.
- CI: auto-generated before each run.

## CI/CD

GitHub Actions workflow (`.github/workflows/playwright.yml`):

- Lint job: runs ESLint on all TypeScript files.
- UI tests job: runs UI scenarios on Chromium and Firefox (matrix), uploads HTML reports as artifacts.
- API tests job: runs API scenarios (tagged `@api`), uploads HTML report.

Reports are available for download from the GitHub Actions run summary.

## Tech Stack

- [Playwright](https://playwright.dev/) 1.64
- [Cucumber.js](https://github.com/cucumber/cucumber-js) 13
- [TypeScript](https://www.typescriptlang.org/) 6.0 (capped below 6.1 by typescript-eslint's peer range)
- [Faker](https://fakerjs.dev/) 10
- [ESLint](https://eslint.org/) 10 + typescript-eslint 8

## Notes

If CAPTCHA blocks UI registration, the API endpoint can be called directly:

```text
POST https://demoqa.com/Account/v1/User
Content-Type: application/json

{ "userName": "string", "password": "string" }
```

Success: `201 Created`. Failure: `400` or `406`.
