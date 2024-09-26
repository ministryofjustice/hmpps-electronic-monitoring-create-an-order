# hmpps-electronic-monitoring-create-an-order <!-- omit in toc -->
[![repo standards badge](https://img.shields.io/badge/endpoint.svg?&style=flat&logo=github&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-electronic-monitoring-create-an-order)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-electronic-monitoring-create-an-order "Link to report")
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-electronic-monitoring-create-an-order/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-electronic-monitoring-create-an-order)

## Contents <!-- omit in toc -->
- [About this project](#about-this-project)
- [Running the app](#running-the-app)
  - [Dependencies](#dependencies)
  - [Running the application locally](#running-the-application-locally)
    - [One-time setup:](#one-time-setup)
    - [Every-time setup:](#every-time-setup)
- [Code quality checks](#code-quality-checks)
  - [Run linter](#run-linter)
  - [Run tests](#run-tests)
    - [Running integration tests](#running-integration-tests)
- [Change log](#change-log)
      

## About this project
A service to allow users to Create Electronic Monitoring Orders. This Typescript front-end application is the user interface for the [HMPPS Create an Electronic Monitoring Order API](https://github.com/ministryofjustice/hmpps-electronic-monitoring-create-an-order-api).

## Running the app
The easiest way to run the app is to use docker compose to create the service and all dependencies. 

`docker compose pull`

`docker compose up`

### Dependencies
The app requires: 
* hmpps-auth - for authentication
* redis - session store and token caching

### Running the application locally

#### One-time setup: 
- Create a personal client in the development environment of DPS with the roles `ROLE_EM_CEMO__CREATE_ORDER` and `ROLE_EM_CEMO__CREATE_DEVICE_WEARER`.
    - This service uses [HMPPS Auth](https://github.com/ministryofjustice/hmpps-auth) in development when run locally. Accordingly, to access the service locally you must first have a personal client created in the dev environment of DPS with the relevant roles. You’ll use this to log into the service, including locally.
    - To do this, you must submit a personal client request by cloning the [request template](https://dsdmoj.atlassian.net/browse/HAAR-664) and asking for a review on the [HMPPS Auth and Audit slack channel](https://moj.enterprise.slack.com/archives/C02S71KUBED).
- Create a .env file in the root level of the repository with the following contents. Replace the Client IDs and Client Secrets with values from Kubernetes secrets.

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
- Install dependencies using `npm install`, ensuring you are using `node v20`
  - Note: Using `nvm` (or [fnm](https://github.com/Schniz/fnm)), run `nvm install --latest-npm` within the repository folder to use the correct version of node, and the latest version of npm. This matches the `engines` config in `package.json` and the CircleCI build config.

#### Every-time setup:

1. To start the main services, excluding the example typescript template app and hmpps auth: 

    `docker compose up --scale=app=0  –scale=hmpps-auth=0`

2.  And then, to build the assets and start the app with esbuild:

    `npm run start:dev`

3.  Access the service via [http://localhost:3000](http://localhost:3000), using your dev environment DPS personal credentials to sign in at the sign in page.


## Code quality checks

### Run linter

`npm run lint`

### Run tests

`npm run test`

#### Running integration tests

1. For local running, start a test db and wiremock instance by:

    `docker compose -f docker-compose-test.yml up`

2. Then run the server in test mode by:

    `npm run start-feature` (or `npm run start-feature:dev` to run with auto-restart on changes)

3. And then either:
   - run tests in headless mode with `npm run int-test`
   - Or run tests with the cypress UI `npm run int-test-ui`

## Change log

A changelog for the service is available [here](./CHANGELOG.md)
