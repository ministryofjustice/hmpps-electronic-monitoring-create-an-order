# hmpps-electronic-monitoring-create-an-order <!-- omit in toc -->

[![repo standards badge](https://img.shields.io/badge/endpoint.svg?&style=flat&logo=github&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-electronic-monitoring-create-an-order)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-electronic-monitoring-create-an-order "Link to report")
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-electronic-monitoring-create-an-order/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-electronic-monitoring-create-an-order)

## Contents <!-- omit in toc -->
- [About this project](#about-this-project)
- [First time setup](#first-time-setup)
- [Running the service locally](#running-the-service-locally)
- [Running this service and the CEMO API locally](#running-this-service-and-the-cemo-api-locally)
- [Tests](#tests)
    - [Unit](#unit-tests)
    - [Integration](#integration-tests)
    - [Scenario](#scenario-tests)
- [Code quality checks](#code-quality-checks)
- [Change log](#change-log)

---


## About this project
This service allows authenticated MoJ users to create and submit electronic monitoring orders by entering data into a webform.

This service acts as a frontend to the [Create an Electronic Monitoring Order API](https://github.com/ministryofjustice/hmpps-electronic-monitoring-create-an-order-api), which is used to persist EM order form data and submit completed EM order forms to the field monitoring service.

This service is hosted in [Cloud Platform](https://user-guide.cloud-platform.service.justice.gov.uk/#cloud-platform-user-guide).

---


## First time setup

### 1. Create a personal client in the development environment of DPS

This service uses the dev instance of [HMPPS Auth](https://github.com/ministryofjustice/hmpps-auth) to authenticate users.

To log into the locally running service (and the dev deployment) you'll need a personal client in the dev environment of DPS with the relevant roles:  
- `ROLE_EM_CEMO__CREATE_ORDER`
- `ROLE_EM_CEMO__CREATE_DEVICE_WEARER`

To request a personal client:
- Clone the [request template](https://dsdmoj.atlassian.net/browse/HAAR-664)
- Post the ticket in the [HMPPS Auth and Audit slack channel](https://moj.enterprise.slack.com/archives/C02S71KUBED) and ask for it to be reviewed & processed.

### 2. Configure .env
- Create a .env file in the root level of the repository with the following contents. Replace the Client IDs and Client Secrets with values from Kubernetes secrets. [See this section of the Cloud Platform User Guide](https://user-guide.cloud-platform.service.justice.gov.uk/documentation/getting-started/kubectl-config.html) for guidance on accessing kubernetes resources.

    ```
    PORT=3000
    HMPPS_AUTH_URL=https://sign-in-dev.hmpps.service.justice.gov.uk/auth
    HMPPS_AUTH_EXTERNAL_URL=https://sign-in-dev.hmpps.service.justice.gov.uk/auth
    TOKEN_VERIFICATION_API_URL=https://token-verification-api-dev.prison.service.justice.gov.uk
    REDIS_ENABLED=false
    NODE_ENV=development
    TOKEN_VERIFICATION_ENABLED=true
    API_CLIENT_ID=[REPLACE WITH API_CLIENT_ID]
    API_CLIENT_SECRET=[REPLACE WITH API_CLIENT_SECRET]
    SYSTEM_CLIENT_ID=[REPLACE WITH SYSTEM_CLIENT_ID]
    SYSTEM_CLIENT_SECRET=[REPLACE WITH SYSTEM_CLIENT_SECRET]
    ENVIRONMENT_NAME=DEV
    CEMO_API_URL=http://localhost:8080
    ```
- Use the command `env` to check that the environment variables are in your current shell session. If any of them aren't listed, then load the environment variables into your current shell session using `export $(cat .env)`

### 3. NPM & dependencies
- Using `nvm` (or [fnm](https://github.com/Schniz/fnm)), run `nvm install --latest-npm` within the repository folder to use the correct version of node, and the latest version of npm. This matches the `engines` config in `package.json` and the CircleCI build config.
- Install dependencies using `npm install`.

---

## Running the service locally
**NOTE: In order for the frontend service to work fully it needs to receive data from the CEMO API.  
[See the next section](#running-the-cemo-frontend-service--cemo-api-locally) for instructions on running both of these services locally.**

1. Start the main services in docker, excluding hmpps-auth and the typescript template app:  
    `docker compose up --scale=app=0 --scale=hmpps-auth=0`

2.  Build assets and start the app with esbuild:  
    `npm run start:dev`

3.  Access the service via [http://localhost:3000](http://localhost:3000).  
Use your HMPPS Auth credentials (dev) to sign in.

---

## Running this service and the CEMO API locally
Running the CEMO frontend & api together locally can be useful for development purposes.

[Instructions are in this section of the API repo](https://github.com/ministryofjustice/hmpps-electronic-monitoring-create-an-order-api#running-this-service-and-the-cemo-frontend-locally).


---

## Tests
This service has several levels of testing:

- Unit
- Integration
- Scenario

These can be run locally, and are also automated in the CI/CD pipeline.

---

### Unit tests
Run with `npm run test`.

---

### Integration tests
1. Start a test db and wiremock instance:  
`docker compose -f docker-compose-test.yml up`

2. Run the server in test mode. Two options:
    - Run with auto-restart on changes: `npm run start-feature:dev`
    - Run without auto-restart: `npm run start-feature`  

3. Run the tests using Cypress. Two options:
   - Run in headless mode: `npm run int-test`
   - Run in the Cypress UI: `npm run int-test-ui`

####  Notes:

- In the Cypress UI, integration tests are in the E2E directory.
- The Cypress UI will also list scenario tests but these won't work.  
To run the scenario tests see [Running scenario tests](#scenario-tests).

---


### Scenario tests

The scenario tests simulate specific user journeys through the CEMO service.  
They can be run in two different ways:
1. Against a containerised instance of the CEMO API running in Docker,  
which matches the version currently deployed to production.
2. Against a local clone of the API repo.  
This allows you to make changes to the API and test against them.


#### Docker run
1. Pull the latest Docker images:  
    `docker compose -f docker-compose-scenarios.yml pull`

2. Start an API, test db and wiremock instance:  
    `docker compose -f docker-compose-scenarios.yml up`

3. Run the server in test mode. Two options:

    - Run with auto-restart on changes: `npm run start-feature:dev`
    - Run without auto-restart: `npm run start-feature`   

4. Run the tests using Cypress. Two options:
   - Run in headless mode: `npm run int-test-scenarios`
   - Run in the Cypress UI: `npm run int-test-ui`


#### Local repo run
1. [Clone the CEMO API](https://github.com/ministryofjustice/hmpps-electronic-monitoring-create-an-order-api) & configure it using the instructions in the readme.

2. Start a test db and wiremock instance:   
    `docker compose -f docker-compose-scenarios.yml up --scale cemo-api=0`

3. Configure the local API for scenario testing:  
    - Populate the environment variables file (e.g. .env) with the following values.

        ```shell
        HMPPS_AUTH_URL=http://localhost:9091/auth
        DB_SERVER=localhost:5432
        DB_NAME=postgres
        DB_USER=postgres
        DB_PASS=postgres
        DOCUMENT_MANAGEMENT_URL=http://localhost:9091/hmpps/
        SERCO_AUTH_URL=http://localhost:9091/auth/oauth/token
        SERCO_CLIENT_ID=
        SERCO_CLIENT_SECRET=
        SERCO_USERNAME=
        SERCO_PASSWORD=
        SERCO_URL=http://localhost:9091/fms
        CP_PROCESSING_ENABLED=false
        CP_FMS_INTEGRATION_ENABLED=false
        CEMO_FMS_INTEGRATION_ENABLED=true
        HMPPS_S3_BUCKETNAME=test_bucket
        ``` 

    - Run the API in intelliJ IDEA.

4. Run the server in test mode. Two options:
    - Run with auto-restart on changes: `npm run start-feature:dev`
    - Run without auto-restart: `npm run start-feature`  

5. Run the tests using Cypress. Two options:
   - Run in headless mode: `npm run int-test-scenarios`
   - Run in the Cypress UI: `npm run int-test-ui`


####  Notes:
- In the Cypress UI, scenario tests are in the Scenarios directory.
- The Cypress UI will also list integration tests but these won't work.  
To run the integration tests see [Running integration tests](#integration-tests).

---


## Code quality checks
Run linter: `npm run lint`

---


## Change log
A change log for the service is available [here](./CHANGELOG.md)

---
