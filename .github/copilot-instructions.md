# Copilot instructions — hmpps-electronic-monitoring-create-an-order

Node.js/Express TypeScript app (Nunjucks views, GOV.UK/MoJ frontend) for creating electronic monitoring orders. It calls the CEMO API and other HMPPS services.

## Repo layout

The codebase is migrating from a layered structure to feature folders under `server/routes/`. **New features must use a feature folder in `server/routes/<feature>/`.** Leave existing code where it is unless the task is to migrate it.

### Target structure (new code)

`server/routes/<feature>/` (kebab-case) contains, as needed:

- `controller.ts` — request handlers
- `service.ts` — business logic
- `formModel.ts` / `viewModel.ts` — Zod form schemas and view models
- `controller.test.ts`, `viewModel.test.ts` etc. — Jest tests, alongside the code

Feature folders may be nested under a section folder (e.g. `server/routes/installation-and-risk/mappa/`). Routes are registered in the section's `router.ts`. Features depend on shared utilities, not on each other.

Reference examples: `server/routes/return-reasons/`, `server/routes/sentencing-act-selection/`, `server/routes/installation-and-risk/mappa/`.

### Current structure (legacy, being migrated)

- `server/controllers/` — Express request handlers, grouped by order section (e.g. `about-the-device-wearer`, `monitoringConditions`).
- `server/routes/` — route definitions and middleware stack.
- `server/services/` — business logic and API client wrappers.
- `server/models/` — types and Zod schemas for API/form data (`form-data/` for form validation).
- `server/middleware/` — auth, session, CSRF, current order/user population.
- `server/views/` — Nunjucks templates. `server/i18n/` — content text.
- `server/data/` — API clients. `server/testutils/`, `test/` — Jest helpers, mocks, fixtures.
- `integration_tests/` — Cypress: `e2e/` specs, `pages/` page objects, `mockApis/` Wiremock stubs, `scenarios/` scenario tests.

When adding a feature, use a `server/routes/<feature>/` folder and follow the nearest analogous existing feature for patterns. Once a feature folder has been migrated, use it as the reference.

## Architecture

- Controllers handle HTTP only. Business logic belongs in services; API access goes through the data clients.
- Routes contain no logic.
- Validate request data with Zod.
- Avoid circular dependencies. Shared code goes in shared utilities.

## Conventions

- Strict TypeScript. Avoid `any`.
- `camelCase` for variables/functions, `PascalCase` for classes/types, `UPPER_SNAKE_CASE` for constants, kebab-case URL paths.
- Use the Bunyan logger, not `console.log`.
- Handle errors and return appropriate HTTP status codes.
- Use `const`/`let`, never `var`.
- Match the style of surrounding code. Keep changes focused and don't refactor unrelated code.

## Commands

| Purpose | Command |
| --- | --- |
| Lint / autofix | `npm run lint` / `npm run lint-fix` |
| Typecheck (app and Cypress) | `npm run typecheck` |
| Unit tests (Jest) | `npm test` |
| Cypress e2e | `npm run int-test` (UI: `npm run int-test-ui`) |
| Scenario tests | `npm run int-test-scenarios` |
| Dev server | `npm run start:dev` |

CI expects lint, typecheck and tests to pass.

## Testing

- Jest tests sit next to the code as `*.test.ts`. Mock external dependencies and cover happy and error paths.
- Cypress specs are in `integration_tests/e2e/`. Use page objects from `integration_tests/pages/` and stubs from `integration_tests/mockApis/`.
- Keep fixtures realistic but minimal.

## Team rules

- Do not add dependencies without agreement. Recommend the package and let the user add it to `package.json`.
- Never commit directly to `main`. Work on a branch and open a PR using `.github/PULL_REQUEST_TEMPLATE.md`, which asks for the Jira ticket (`ELM-XXX`).
- Never commit secrets.
