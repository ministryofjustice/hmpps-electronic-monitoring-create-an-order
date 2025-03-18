# 01 - Validation

## Status

Accepted

## Context

Validation is needed to ensure the data captured in the online form is able to be sent to Serco and to ensure that the data is operationally useful to the enable the monitoring of a device wearer.

Within the service, there are three places that validation could occur:

1. Client side in the browser
2. Server side in the user interface application
3. Server side in api application

The preference is to perform as much validation as possible in the API application to ensure consistency and maintain a single source of truth. Validation within the user interface app is only performed where necessary to improve the user experience. An example of this is when validating the individual datetime components in before sending a single ISO-8601 datetime string to the API. Client side validation will be avoided.

## Decision

- The API application will handle primary validation logic to ensure data integrity and enforce business rules.
- The UI application will perform minimal validation only when required for usability. When a form requires validation in the user interface, the entire form will be validated to prevent a clunky user experience where different parts of the form get validated at different points in time.
- No client side validation will occur.

## Consequences

### Positive
- Consistent validation for all current and future consumers of the API.
- Reduced duplication of validation logic across multiple layers of the service.
- Selective validation in the user interface app allows improved user experience where required.

### Negative
- Slight increase in load on the API. Invalid inputs will reach the API more frequently as they won't have been validated in the user interface application.
- Minor increase in request latency. Errors are detected later in the request lifecycle.

### Future implications
- As the form evolves, this subject should be revisited to address changes to the form. For example, use of the [MOJ Date Picker](https://design-patterns.service.justice.gov.uk/components/date-picker/) could remove the need to validate individual date time components separately, removing one of the primary reasons for including validation logic in the user interface application.

## Alternatives

- Full client-side and server-side validation
  Rejected due to added complexity and duplication of validation logic across two code bases.
- Only perform validation in the api
  Rejected as it will create a poor user experience, particularly for more complex inputs like dates.