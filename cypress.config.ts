import { fakerEN_GB as faker } from '@faker-js/faker'
import { defineConfig } from 'cypress'

import { resetStubs } from './integration_tests/mockApis/wiremock'
import auth from './integration_tests/mockApis/auth'
import tokenVerification from './integration_tests/mockApis/tokenVerification'
import cemo from './integration_tests/mockApis/cemo'
import fms from './integration_tests/mockApis/fms'

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  taskTimeout: 60000,
  e2e: {
    setupNodeEvents(on) {
      const seed = faker.seed(Math.random() * Number.MAX_SAFE_INTEGER)

      // eslint-disable-next-line no-console
      console.log(`Random seed: ${seed}`)

      on('task', {
        reset: resetStubs,
        ...auth,
        ...tokenVerification,
        ...cemo,
        ...fms,
        /*
         * used to output summary accessibility testing issues found to console during integration testing
         */
        log(message) {
          // eslint-disable-next-line no-console
          console.log(message)

          return null
        },
        /*
         * used to output table accessibility testing details found to console during integration testing
         */
        table(message) {
          // eslint-disable-next-line no-console
          console.table(message)

          return null
        },
      })
    },
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: [
      'integration_tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
      'integration_tests/scenarios/**/*.cy.{js,jsx,ts,tsx}',
    ],
    supportFile: 'integration_tests/support/index.ts',
  },
})
