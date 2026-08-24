# GitHub Copilot Instructions - hmpps-electronic-monitoring-create-an-order

## 1. Before Starting Work

For feature work, ask for the Jira ticket ID (`ELM-XXXX`) when it would provide
missing context. Do not block bug fixes, maintenance, investigation, or other
well-specified work solely because no ticket was provided.

1. Clarify requirements that affect behaviour, validation, content, security, or
   user journeys before writing code.
2. Find the nearest analogous controller, service, model, view, page object, and
   test, then follow the established pattern.
3. Run the smallest relevant test or check to establish a baseline.
4. Make focused changes. Do not refactor unrelated code.

- Add or update tests for every behaviour change.
- Do not weaken or remove assertions without understanding the behaviour they
  protect.
- Do not add a dependency when the standard library, an existing dependency, or
  a local project pattern solves the problem.
- Preserve authentication, authorisation, CSRF, session, audit, validation,
  accessibility, feature-flag, and error-handling behaviour unless the
  requirement explicitly changes it.
- Treat the accepted decisions in `adrs/` as the source of truth. Update the
  relevant ADR when deliberately changing an architectural decision.

### Checks before completing a task

Use the npm scripts from `package.json`:

```bash
npm run lint
npm run typecheck
npm test
```

Prefer a targeted Jest test while developing, for example:

```bash
npm test -- --runTestsByPath server/path/to/file.test.ts
```

Cypress integration and scenario tests require different underlying environments.
Do not run one suite against the other suite's environment.

For integration tests under `integration_tests/e2e/`:

```bash
docker compose -f docker-compose-test.yml up
npm run start-feature:dev
npm run int-test
```

For scenario tests under `integration_tests/scenarios/` using the containerised
CEMO API:

```bash
docker compose -f docker-compose-scenarios.yml pull
docker compose -f docker-compose-scenarios.yml up
npm run start-scenarios:dev
npm run int-test-scenarios
```

The non-watching server alternatives are `npm run start-feature` and
`npm run start-scenarios`. A targeted Cypress spec may be run with
`npm run cy:run -- --spec '<spec-path>'` only after starting the environment for
that spec's suite. `npm run int-test-ui` lists both suites, but only open specs
from `integration_tests/e2e/` in the integration environment and specs from
`integration_tests/scenarios/` in the scenario environment. See `README.md` for
running scenario tests against a local CEMO API clone. Use Node 20 or later and
npm 10 or later.

## 2. Project Architecture

This project is a server-rendered TypeScript application for creating and
managing electronic monitoring orders. It uses Express, Nunjucks, GOV.UK
Frontend, MOJ Frontend, Zod, Passport, Jest, and Cypress. The CEMO API remains
the system of record for order data and primary business validation.

Follow the existing request flow:

```text
Express middleware -> Route -> Controller -> Service -> Data client / CEMO API
                                      |
                                      -> View model -> Nunjucks view
```

- `server/routes/` wires routes, middleware, and injected services to
  controllers. Keep route handlers thin.
- `server/controllers/` coordinates HTTP input, service calls, flash data,
  redirects, and rendering. Do not put API transport details or substantial
  business rules in controllers.
- `server/services/` owns UI application workflows, request validation and
  transformation, API calls, and expected backend-error conversion.
- `server/data/` owns HTTP, authentication-token, audit, postcode, and PDF
  transport concerns. Reuse the existing clients rather than making ad hoc
  network calls.
- `server/models/` contains API/domain models plus separate `form-data` and
  `view-models` representations. Validate untrusted data at these boundaries.
- `server/middleware/` establishes cross-cutting request context such as the
  current user and current order.
- `server/views/` contains Nunjucks presentation. Views must not make business
  decisions or access services directly.
- `server/i18n/` and `server/types/i18n/` provide version-aware content and
  reference data.
- `integration_tests/pages/` contains Cypress page objects;
  `integration_tests/e2e/` contains page and feature coverage; and
  `integration_tests/scenarios/` contains complete reusable journeys.

Dependency construction belongs in `server/services/index.ts` and related
composition modules. Follow the neighboring constructor-injection pattern when
adding a controller or service.

Do not attempt a repository-wide architectural rewrite. Improve boundaries
locally when changing an area without renaming or restructuring unrelated code.

## 3. Forms, Validation, and Navigation

Follow `adrs/01-validation.md` and `adrs/02-post-redirect-get.md`.

### Validation ownership

- The API owns primary data-integrity and business-rule validation.
- Add UI validation only where it is necessary for usability, such as assembling
  and validating multipart date or time values before producing an API value.
- When UI validation is necessary, validate the whole form together.
- Do not add client-side validation by default. Avoid duplicating API business
  rules in browser JavaScript or UI validators.
- Parse submitted shapes with the form's Zod parser before passing typed data to
  a service.
- In the service, use the corresponding validator when transforming data for the
  API. Convert expected Zod and API `400` errors with the utilities in
  `server/utils/errors.ts` and return a `ValidationResult`.
- Re-throw unexpected errors so the central Express error handler can process
  them. Do not turn infrastructure failures into validation errors or
  success-shaped responses.

### Post/Redirect/Get

All form submissions use Post/Redirect/Get:

1. The POST controller parses the submitted form and calls a service.
2. On validation failure, flash `formData` and `validationErrors` to the session.
3. Redirect to the form's GET route.
4. The GET controller constructs the view model from the API model plus any
   flashed form data and errors, then renders the page.
5. On success, redirect according to the submitted action. Use
   `TaskListService.getNextPage` for established continue flows and the order
   summary path for save-and-return flows.

Never render a form directly from its POST handler. Preserve the user's submitted
values when redisplaying invalid forms.

Use `server/controllers/about-the-device-wearer/deviceWearerController.ts`,
`server/services/deviceWearerService.ts`, and their form/view models as a
representative implementation, while preferring a closer example in the feature
being changed.

## 4. Orders, Versions, and Feature Flags

- Use the order loaded by `server/middleware/populateCurrentOrder.ts` through
  `req.order`. Do not fetch it again in controllers without a specific need.
- Use `res.locals.orderId`, `orderStatus`, `isOrderEditable`, `isViewOnly`,
  `versionId`, and `orderSummaryUri` where the middleware already supplies the
  required view context.
- Preserve the distinction between an order ID and an order-version ID. Routes
  and links for historical versions must retain the version context.
- Respect order status, ownership, and view-only behaviour. Do not expose editing
  controls or mutation routes for orders that are not editable.
- Read feature flags through the existing `FeatureFlags` abstraction. Preserve
  safe defaults and cover both enabled and disabled behaviour when a flag changes
  routing, content, or workflow.
- Remove obsolete flag branches when a feature flag is retired; do not leave
  unreachable parallel implementations.

## 5. Authentication, Security, and External Services

- Use the authenticated token supplied at `res.locals.user.token` and pass it to
  services as `accessToken`.
- Keep role checks in the existing authorisation middleware and route patterns.
  Do not implement security by hiding controls in a view alone.
- Preserve the middleware ordering in `server/app.ts` unless the change explicitly
  requires and tests a different order.
- Use `RestClient` and the existing specialised clients for external calls. Keep
  paths, timeouts, multipart handling, token forwarding, and error sanitisation in
  the data-client layer.
- Use the existing audit service for auditable user actions and retain Application
  Insights telemetry where established.
- Use the shared logger and central error handling. Never log access or refresh
  tokens, client secrets, session data, uploaded document contents, or sensitive
  personal data.
- Do not expose raw upstream errors to users. Preserve production sanitisation and
  the existing handling for authentication, authorisation, not-found, and server
  errors.

## 6. GOV.UK Views, Content, and Accessibility

- Use GOV.UK Frontend and MOJ Frontend Nunjucks macros before creating custom
  markup or components.
- Follow the nearest existing page and layout. Keep Nunjucks templates focused on
  rendering the supplied view model.
- Construct typed view models under `server/models/view-models/`. Support both
  persisted API data and flashed submitted form data where the page is editable.
- Build validation summaries and field error messages with the existing utilities
  in `server/utils/errors.ts`. Ensure summary links and `focusTarget` values point
  to the correct rendered input, including multipart date and time controls.
- Source user-facing content and reference-data labels through the existing typed,
  version-aware i18n/data-dictionary structure. Do not hard-code content that is
  already supplied there.
- Preserve semantic HTML, labels, legends, hints, heading hierarchy, keyboard
  navigation, and visible focus states. Conditional content must remain usable
  without relying solely on visual presentation.
- Add or update Cypress accessibility coverage for changed pages using the
  existing `checkIsAccessible()` pattern.
- Put browser behaviour in `assets/js/` and styling in `assets/scss/`, following
  the existing GOV.UK enhancement approach. Server-rendered core journeys must
  remain usable without new client-side JavaScript unless the requirement says
  otherwise.

## 7. TypeScript Conventions

Follow `tsconfig.json`, `eslint.config.mjs`, and nearby code.

- Keep strict TypeScript types. Do not introduce `any`, unchecked casts, or
  non-null assertions when a schema, type guard, or explicit guard can establish
  the invariant.
- Use `PascalCase` for classes and types, `camelCase` for functions and variables,
  and `UPPER_SNAKE_CASE` for constants and enum values where that matches the
  existing model.
- Prefer existing enums, schemas, path constants, and helpers over magic strings.
- Keep API models, submitted form models, and rendered view models distinct.
- Parse external API responses with the relevant Zod model before returning them
  from a service.
- Use async handlers and the established Express error-propagation pattern. Do not
  swallow rejected promises or broad exceptions.
- Add comments only when intent cannot be expressed clearly in code.
- Preserve the repository's formatting and import conventions; run ESLint rather
  than manually restyling unrelated files.

## 8. Testing

### Jest tests

- Keep unit tests beside server code using the existing `*.test.ts` or `*.cy.ts`
  convention configured in `package.json`.
- Test controllers for render inputs, flash behaviour, redirects, and service
  calls.
- Test services for request transformation, API interaction, Zod errors, expected
  backend validation errors, response parsing, and propagation of unexpected
  failures.
- Test form-data and view-model code for conditional fields, transformations,
  error messages, summaries, and focus targets.
- Reuse the mocks in `test/mocks/` and the nearest test setup rather than creating
  incompatible Express, order, or client fixtures.

### Cypress tests

- Integration tests and scenario tests are not interchangeable:
  - `integration_tests/e2e/` uses the `docker-compose-test.yml` environment and
    the application started with `start-feature` or `start-feature:dev`.
  - `integration_tests/scenarios/` uses the `docker-compose-scenarios.yml`
    environment and the application started with `start-scenarios` or
    `start-scenarios:dev`.
- Select the environment from the spec's directory before running or debugging
  Cypress. Do not assume that seeing a spec in the Cypress UI means it can run in
  the currently active environment.
- Add page interactions and assertions to page objects under
  `integration_tests/pages/`; avoid scattering selectors throughout specs.
- Prefer label-, legend-, role-, and text-based helpers from the existing Cypress
  commands over brittle CSS selectors.
- Reset WireMock state and use the tasks in `cypress.config.ts` and `mockApis/` to
  stub authentication and upstream APIs.
- Put focused route, rendering, and workflow tests in `integration_tests/e2e/`.
  Put complete order journeys in `integration_tests/scenarios/` and reuse the
  flows under `integration_tests/utils/scenario-flows/`.
- For a changed form or endpoint, cover the relevant combination of:
  - successful rendering and submission;
  - validation errors, retained submitted values, and error focus;
  - continue and save-and-return navigation;
  - conditional content and omitted values;
  - authentication, role, ownership, status, and version behaviour;
  - enabled and disabled feature-flag behaviour;
  - expected API failures; and
  - accessibility.

Keep fixtures explicit enough that a test's domain state is understandable. Reuse
builders and flows when they clarify the test, but do not hide the behaviour under
test behind excessive abstraction.