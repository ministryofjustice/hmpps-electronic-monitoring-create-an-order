# GitHub Copilot Instructions — hmpps-electronic-monitoring-create-an-order

## 1. Before Starting Any Feature

1. **Ask for the Jira ticket ID** (`ELM-XXX`) if not provided.
2. **Clarify any ambiguous requirements** before writing code.
3. **Run the tests** to confirm a clean baseline: `npm test`.
4. **Run the type checker** to confirm TypeScript compilation: `npm run typecheck`.
5. **Find the nearest analogous existing feature** and follow the same pattern exactly.

## 2. Workflow

- **Start by writing tests.** Write the test first, then implement code to make it pass.
- **Run tests after every change.** New tests must fail first, then pass after implementation.
- **Type checking must pass.** Run `npm run typecheck` before committing — all code must have proper TypeScript types.
- **NEVER install a new dependency without asking.** Stop and recommend a dependency for the user to add to `package.json`.
- **All code MUST match the architecture.** Keep business logic out of routers and keep concerns separated.
- **When finished**, run all checks and update documentation.

### Checks before completing any task

```bash
npm run lint-fix     # Fix linting issues
npm run typecheck    # TypeScript compilation
npm test             # All tests
```

### When editing existing files

- Make surgical changes only. Do not refactor unrelated code.
- Do not change test assertions without understanding why they were written that way.
- Fix linting and type errors — do not suppress rules unless unavoidable and justified.

If these instructions do not cover a specific case, stop and ask.

## 3. Architecture Rules

This project is a **Node.js/Express TypeScript application** for creating electronic monitoring orders.

- **`server/`** — Main application code organized by feature.
- **`server/[feature]/`** — Feature folders containing:
  - `[feature].controller.ts` — Request handlers (Express middleware)
  - `[feature].service.ts` — Business logic
  - `[feature].routes.ts` — Route definitions
  - `[feature].types.ts` — TypeScript interfaces and types
  - `[feature].test.ts` — Unit and integration tests
- **`test/`** — Test utilities, fixtures, and configuration.
- **`integration_tests/`** — End-to-end tests using Cypress.
- **`server.ts`** — Express app factory and middleware setup.

### Architecture principles

- **Controllers** handle HTTP requests/responses only. Never contain business logic.
- **Services** contain all business logic. Controllers delegate to services.
- **Types** define interfaces and types. Keep them near the feature they describe.
- **Routes** define the Express router and middleware stack. No logic here.
- **Keep concerns separated.** No direct database access in controllers; use services.
- **No circular dependencies.** Features should depend on shared utilities, not on each other.

### Adding a new feature

1. Create a new folder `server/[feature]`.
2. Define types in `server/[feature]/[feature].types.ts`.
3. Implement business logic in `server/[feature]/[feature].service.ts`.
4. Implement request handlers in `server/[feature]/[feature].controller.ts`.
5. Define routes in `server/[feature]/[feature].routes.ts`.
6. Register the router in `server.ts` using `app.use()`.
7. Write tests in `server/[feature]/[feature].test.ts` (unit tests) and `integration_tests/` (E2E tests).

## 4. Coding Conventions

- **TypeScript throughout.** All code must have explicit type annotations. No `any` types unless absolutely unavoidable.
- **Use `camelCase`** for all identifiers; `PascalCase` for classes and interfaces; `UPPER_SNAKE_CASE` for constants.
- **No `console.log()` in production code.** Use the logging library (Bunyan) already in the project.
- **Error handling.** Catch errors and return appropriate HTTP status codes. Do not let unhandled exceptions propagate.
- **String validation.** Use Zod schemas for request validation (already in the project).
- **Prefer const/let over var.** Never use `var`.

### Naming

| Thing                 | Convention         | Example                              |
| --------------------- | ------------------ | ------------------------------------ |
| Files / folders       | `kebab-case`       | `order-service.ts`, `order-service/` |
| Classes               | `PascalCase`       | `OrderService`, `OrderController`   |
| Constants             | `UPPER_SNAKE_CASE` | `MAX_ORDERS`, `DEFAULT_TIMEOUT`     |
| Functions / variables | `camelCase`        | `createOrder`, `orderId`            |
| URL paths             | `kebab-case`       | `/electronic-monitoring/orders`     |
| Test files            | `[name].test.ts`   | `order.test.ts`                     |
| Interfaces / Types    | `PascalCase`       | `OrderRequest`, `OrderResponse`     |

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

## 6. Git and Version Control

- **Commit often.** Small, logical commits are easier to review.
- **Use descriptive commit messages.** Follow the repo's existing commit style.
- **Create a branch for each feature.** Never commit directly to `main`.
- **Open a pull request when ready for review.** Do not merge without approval.

## 7. Exploration

Always output exploration and plans as markdown in your session, not in the repo.
