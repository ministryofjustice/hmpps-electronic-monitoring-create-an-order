import { defineConfig } from 'cypress'
import cypressSplit from 'cypress-split'
import { fakerEN_GB as faker } from '@faker-js/faker'
import fs from 'fs'
import path from 'path'

import logger from './logger'
import { resetStubs } from './integration_tests/mockApis/wiremock'
import auth from './integration_tests/mockApis/auth'
import tokenVerification from './integration_tests/mockApis/tokenVerification'
import cemo from './integration_tests/mockApis/cemo'
import fms from './integration_tests/mockApis/fms'
import hmppsDocumentManagement from './integration_tests/mockApis/hmppsDocumentManagement'

const featureFlagFilePath = path.join(process.cwd(), 'data', 'feature-flags.json')
const defaultFeatureFlagFilePath = path.join(process.cwd(), 'data', 'default-feature-flags.json')

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
    setupNodeEvents(on, config) {
      const seed = faker.seed(Math.random() * Number.MAX_SAFE_INTEGER)

      // eslint-disable-next-line no-console
      console.log(`Random seed: ${seed}`)

      on('task', {
        reset: resetStubs,
        ...auth,
        ...tokenVerification,
        ...cemo,
        ...fms,
        ...hmppsDocumentManagement,
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
        /*
        * Used to change feature flags during integration testing.
        Takes an object of flags. Only updates the values of flags that already exist; won't create new flags.
        */
        setFeatureFlags(newFlags: Record<string, boolean | string>) {
          return fs.promises
            .readFile(featureFlagFilePath, 'utf-8')
            .then(data => {
              const flags = JSON.parse(data) as Record<string, boolean | string>

              Object.entries(newFlags).forEach(([key, value]) => {
                if (key in flags) {
                  flags[key] = value
                } else {
                  logger.warn(`Flag ${key} not found.`)
                }
              })

              const jsonString = JSON.stringify(flags, null, 2)
              return fs.promises.writeFile(featureFlagFilePath, jsonString, 'utf-8')
            })
            .then(() => null)
        },
        /*
         * Used to reset feature flags to their original values after integration testing.
         */
        resetFeatureFlags() {
          return fs.promises.copyFile(defaultFeatureFlagFilePath, featureFlagFilePath).then(() => null)
        },
      })
      cypressSplit(on, config)
      return config
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
