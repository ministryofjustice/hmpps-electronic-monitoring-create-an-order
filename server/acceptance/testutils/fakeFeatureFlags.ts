type FeatureFlagMap = Record<string, boolean | string>

// Mirrors FeatureFlags.loadFlagsFromEnv() so that tests which set
// process.env before importing the app (as the real class does) see the
// same defaults, without touching the shared flags file on disk.
const loadDefaultFlagsFromEnv = (): FeatureFlagMap => ({
  CREATE_NEW_ORDER_VERSION_ENABLED: process.env.CREATE_NEW_ORDER_VERSION_ENABLED === 'true',
  SERVICE_REQUEST_TYPE_ENABLED: process.env.SERVICE_REQUEST_TYPE_ENABLED === 'true',
  TAG_AT_SOURCE_PILOT_PRISONS: process.env.TAG_AT_SOURCE_PILOT_PRISONS ?? '',
  DAPOL_PILOT_PROBATION_REGIONS: process.env.DAPOL_PILOT_PROBATION_REGIONS ?? '',
  LICENCE_VARIATION_PROBATION_REGIONS: process.env.LICENCE_VARIATION_PROBATION_REGIONS ?? '',
  OFFENCE_FLOW_ENABLED: process.env.OFFENCE_FLOW_ENABLED === 'true',
  DOWNLOAD_FMS_REQUEST_JSON_ENABLED: process.env.DOWNLOAD_FMS_REQUEST_JSON_ENABLED === 'true',
  TECHNOLOGY_PORTAL_PILOT_PRISONS: process.env.TECHNOLOGY_PORTAL_PILOT_PRISONS ?? '',
  SENTENCING_ACT_ENABLED: process.env.SENTENCING_ACT_ENABLED === 'true',
})

/**
 * In-memory stand-in for the real FeatureFlags class.
 *
 * The real class persists flags to a shared file on disk (see
 * server/utils/featureFlags.ts) so that a separately running server process
 * (e.g. under Cypress) can pick up flag changes written by a test runner.
 * Acceptance tests run the whole app in-process, so there is no second
 * process to communicate with -- writing to that same shared file caused
 * flaky cross-test/cross-worker pollution when suites ran in parallel. This
 * fake keeps flag state in memory, scoped to whichever test file mocks it.
 */
export class FakeFeatureFlags {
  private flags: FeatureFlagMap

  constructor(overrides: FeatureFlagMap = {}) {
    this.flags = { ...loadDefaultFlagsFromEnv(), ...overrides }
  }

  async resetFeatureFlags(): Promise<null> {
    this.flags = loadDefaultFlagsFromEnv()
    return null
  }

  async setFlag(flagName: string, value: boolean): Promise<null> {
    if (flagName in this.flags) {
      this.flags[flagName] = value
    }
    return null
  }

  getAll(): FeatureFlagMap {
    return { ...this.flags }
  }

  get(flagName: string): boolean {
    if (!(flagName in this.flags)) {
      throw new Error(`Feature flag "${flagName}" not defined.`)
    }
    return this.flags[flagName] as boolean
  }

  getValue(flagName: string): string {
    if (!(flagName in this.flags)) {
      throw new Error(`Feature flag "${flagName}" not defined.`)
    }
    return this.flags[flagName] as string
  }
}

/**
 * Builds a `{ getInstance }` shaped object matching the real FeatureFlags
 * module's default export, backed by a FakeFeatureFlags instance. Use it in
 * a `jest.mock('.../utils/featureFlags', () => mockFeatureFlags())` call.
 */
export const mockFeatureFlags = (overrides: FeatureFlagMap = {}) => {
  const instance = new FakeFeatureFlags(overrides)
  return {
    __esModule: true,
    default: {
      getInstance: () => instance,
    },
  }
}
