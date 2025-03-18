# 02 - Post / Redirect / Get

## Status

Accepted

## Context

The primary feature of the create an electronic monitoring order application is capturing data from users with forms. To prevent a poor user experience such as duplicate submissions due to browser resubmission prompts, an approach is required that ensures safe and idempotent flow after form submission.

## Decision

The Post/Redirect/Get (PRG) pattern can be used to handle form submissions:

1. The user submits a form via a POST request.
2. The server processes the request and send the data to the API.
3. Instead of rendering a response directly, the server responds with a redirect to a GET route.
4. The GET route fetches any necessary data from the session or API and renders the response, ensuring the page is safe to refresh or navigate back to without causing resubmissions.

## Consequences

### Positive
- Prevents duplicate form submission on page refresh
- Improves user experience by enabling safe navigation

### Negative
- Requires an additional request cycle
- Adds additional complexity by requiring invalid form data to be saved in the session.

## Alternatives

N/A
