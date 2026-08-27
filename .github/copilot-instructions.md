# GitHub Copilot Instructions — hmpps-electronic-monitoring-create-an-order

## 1. Before Starting Any Feature

1. **Ask for the Jira ticket ID** (`ELM-XXX`) if not provided.
2. **Clarify any ambiguous requirements** before writing code.
3. **Run the unit tests** to confirm a clean baseline: `npm test`
4. **Run the type checker** to confirm TypeScript compilation: `npm run typecheck`.
5. **Find the nearest analogous existing feature** and follow the same pattern exactly.

## 2. Workflow

- **Follow TDD at every appropriate level.** Start by writing a failing test, then implement the smallest change that makes it pass. Apply this workflow to unit, integration, and scenario tests when the change warrants that level of coverage.
- **Use focused tests during red/green iterations.** When fixing a failing test, run only the relevant test or test group after each change; do not run every test suite on every iteration. Run all relevant tests for the changed behaviour once the focused test is green, and run the required completion checks before finishing.
- **Type checking must pass.** Run `npm run typecheck` before committing — all code must have proper TypeScript types.
- **NEVER install a new dependency without asking.** Stop and recommend a dependency for the user to add to `package.json`.
- **All code MUST match the architecture.** Keep business logic out of routers and keep concerns separated.
- **When finished**, run all checks and update documentation.

### Checks before completing any task

```bash
npm run lint-fix     # Fix linting issues
npm run typecheck    # TypeScript compilation
npm test             # Jest unit tests only
```

Do not attempt to run integration or scenario tests (`npm run int-test*`) as part of these checks — they require Docker services and a running server (see section 5) and are not a substitute for the unit test suite above.

### When editing existing files

- Make surgical changes only. Do not refactor unrelated code.
- Do not change test assertions without understanding why they were written that way.
- Fix linting and type errors — do not suppress rules unless unavoidable and justified.

If these instructions do not cover a specific case, stop and ask.

## 3. Architecture Rules

This project is a **Node.js/Express TypeScript application** for creating electronic monitoring orders. Code is organized **by layer**, not by feature — each layer has its own top-level folder under `server/`.

- **`server/controllers/[feature]/`** — Request handlers, folder name in `camelCase` (e.g. `installationAndRisk`). Controller files are named `[Name]Controller.ts` and default-export a class, e.g. `InstallationAndRiskController`.
- **`server/services/[feature]Service.ts`** — Business logic as a single flat file per feature (not a folder), default-exporting a class, e.g. `InstallationAndRiskService`. Pass dependencies, such as `RestClient`, into the class constructor.
- **`server/routes/[feature-kebab-case]/`** — Route definitions, folder name in `kebab-case` (e.g. `installation-and-risk`), with a `router.ts` that exports a factory function taking a `Services` object and wiring up controllers. Larger features have sub-route folders each with their own `controller.ts`.
- **`server/models/`** — Domain models and form-data validators, `PascalCase` files (e.g. `InstallationAndRisk.ts`), with Zod validators in `server/models/form-data/`.
- **`server/interfaces/`** — Shared request/response and utility types (e.g. `request.ts`, `result.ts`).
- **`test/`** — Test utilities, fixtures, and configuration.
- **`integration_tests/`** — End-to-end tests using Cypress.
- **`server.ts`** — Express app factory and middleware setup.

### Architecture principles

- **Controllers** handle HTTP requests/responses only. Never contain business logic.
- **Services** contain all business logic. Controllers delegate to services via constructor injection.
- **Models** define domain types and Zod validators. Keep them in `server/models/`.
- **Routes** define the Express router and middleware stack. No logic here — routers receive a `Services` object and construct controllers.
- **Keep concerns separated.** No direct database access in controllers; use services.
- **No circular dependencies.** Features should depend on shared utilities, not on each other.

### Adding a new feature

1. Define models/validators in `server/models/` (and `server/models/form-data/` if using Zod validation).
2. Implement business logic in `server/services/[feature]Service.ts`.
3. Implement request handlers in `server/controllers/[feature]/[Name]Controller.ts` (camelCase folder).
4. Define routes in `server/routes/[feature-kebab-case]/router.ts` (kebab-case folder).
5. Register the router in `server.ts` (or the parent router) using `app.use()`.
6. Write unit tests alongside each file as `[name].test.ts`, and E2E tests in `integration_tests/`.

## 4. Coding Conventions

- **TypeScript throughout.** All code must have explicit type annotations. No `any` types unless absolutely unavoidable.
- **Use `camelCase`** for all identifiers; `PascalCase` for classes and interfaces; `UPPER_SNAKE_CASE` for constants.
- **No `console.log()` in production code.** Use the logging library (Bunyan) already in the project.
- **Error handling.** Catch errors and return appropriate HTTP status codes. Do not let unhandled exceptions propagate.
- **String validation.** Use Zod schemas for request validation (already in the project).
- **Prefer const/let over var.** Never use `var`.

### Naming

| Thing                    | Convention         | Example                                          |
| ------------------------ | ------------------ | ------------------------------------------------- |
| Service files            | `camelCase`        | `installationAndRiskService.ts`                    |
| Controller folders       | `camelCase`        | `server/controllers/installationAndRisk/`          |
| Route folders            | `kebab-case`       | `server/routes/installation-and-risk/`             |
| Model files              | `PascalCase`       | `InstallationAndRisk.ts`                           |
| Classes                  | `PascalCase`       | `OrderService`, `InstallationAndRiskController`    |
| Constants                | `UPPER_SNAKE_CASE` | `MAX_ORDERS`, `DEFAULT_TIMEOUT`                    |
| Functions / variables    | `camelCase`        | `createOrder`, `orderId`                           |
| URL paths                | `kebab-case`       | `/electronic-monitoring/orders`                    |
| Test files               | `[name].test.ts`   | `orderService.test.ts`                             |
| Interfaces / Types       | `PascalCase`       | `OrderRequest`, `OrderResponse`                    |

## 5. Testing Standards

This project uses **Jest** for unit tests and **Cypress** for E2E tests.

### Jest Unit Tests (`server/[feature]/[feature].test.ts`)

- Test all business logic in services.
- Mock external dependencies (HTTP calls, database, etc.).
- Test happy paths and error paths.
- Use descriptive test names:
  ```typescript
  describe('OrderService', () => {
    it('should create an order with valid input', () => {
      // test
    });
    it('should throw error when order data is invalid', () => {
      // test
    });
  });
  ```

### Cypress E2E Tests (`integration_tests/e2e/`)

- Test user workflows from the browser.
- Mirror the feature structure: one folder per feature.
- Cover happy paths and common error paths.
- Always clean up test data after tests run.
- Use page objects for reusable UI selectors:
  ```typescript
  // integration_tests/pages/order.page.ts
  export class OrderPage {
    visitCreateOrder() { cy.visit('/electronic-monitoring/orders/create'); }
    fillOrderDetails(details) { /* ... */ }
  }
  ```

### Fixtures and Test Data

- Use `test/jest/` for Jest fixtures and mock data.
- Use `integration_tests/fixtures/` for Cypress test data.
- Keep test data realistic but minimal.

### How to run each test level

- **Unit tests:** `npm test` (Jest). No other setup required. This is the only test level to run automatically as part of routine checks (section 1/2).
- **Integration tests:** require Docker services and a running server — do NOT attempt to run these without asking, and never as a substitute for `npm test`.
  1. `docker compose -f docker-compose-test.yml up` — starts a test DB and WireMock instance.
  2. `npm run start-feature` (or `npm run start-feature:dev` for auto-restart) — runs the server in test mode.
  3. `npm run int-test` (headless) or `npm run int-test-ui` (Cypress UI) — runs specs in `integration_tests/e2e/`.
- **Scenario tests:** simulate full user journeys against the CEMO API — also require Docker and a running server; do NOT attempt to run these without asking. Run in one of two modes:
  - **Docker run** (CEMO API runs in Docker, matching production):
    1. `docker compose -f docker-compose-scenarios.yml pull` — pulls the latest images.
    2. `docker compose -f docker-compose-scenarios.yml up` — starts the API, test DB, and WireMock.
    3. `npm run start-scenarios` (or `npm run start-scenarios:dev` for auto-restart) — runs the server in test mode.
    4. `npm run int-test-scenarios` (headless) or `npm run int-test-ui` (Cypress UI) — runs specs in `integration_tests/scenarios/`.
  - **Local API repo run** (test against a local clone of the CEMO API, e.g. for API changes):
    1. `docker compose -f docker-compose-scenarios.yml up --scale cemo-api=0` — starts only the test DB and WireMock (no containerised API).
    2. Ask the user: "Are you running the CEMO API locally in scenario test mode, ready for me to run the scenario tests against your local API changes?" Do not attempt to clone, configure, or start the API yourself — assume the user has already set it up per the [CEMO API repo](https://github.com/ministryofjustice/hmpps-electronic-monitoring-create-an-order-api) instructions.
    3. `npm run start-scenarios` (or `npm run start-scenarios:dev`) — runs the server in test mode.
    4. `npm run int-test-scenarios` (headless) or `npm run int-test-ui` (Cypress UI) — runs specs in `integration_tests/scenarios/`.

**Do not mix Docker Compose stacks.** There are three separate compose files — `docker-compose.yml` (local dev), `docker-compose-test.yml` (integration tests), and `docker-compose-scenarios.yml` (scenario tests) — and they share ports (e.g. `6379` for redis, `3001` for gotenberg). Before starting one, bring down any other stack that may already be running (`docker compose -f <file> down`) to avoid port conflicts or tests running against the wrong containers. Never assume a stack is already up — check with `docker compose -f <file> ps` first.

## 6. Git and Version Control

- **Commit often.** Small, logical commits are easier to review.
- **Use descriptive commit messages.** Follow the repo's existing commit style.
- **Create a branch for each feature.** Never commit directly to `main`.
- **Open a pull request when ready for review.** Do not merge without approval.

## 7. Exploration

Always output exploration and plans as markdown in your session, not in the repo.
