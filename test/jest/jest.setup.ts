// Establishes a deterministic baseline for feature-flag environment
// variables before any test file runs. Without this, tests that read
// FeatureFlags via process.env (see server/utils/featureFlags.ts) could pick
// up values left behind by other tests/files sharing the same Jest worker
// process, since process.env is global to the worker and not sandboxed per
// test file. Individual tests can still override a flag for their own file
// via FeatureFlags.getInstance().setFlag(...) or, in acceptance tests, via
// mockFeatureFlags({ ... }) overrides.
const defaultFeatureFlagEnv: Record<string, string> = {
  CREATE_NEW_ORDER_VERSION_ENABLED: 'false',
  SERVICE_REQUEST_TYPE_ENABLED: 'false',
  TAG_AT_SOURCE_PILOT_PRISONS: '',
  DAPOL_PILOT_PROBATION_REGIONS: '',
  LICENCE_VARIATION_PROBATION_REGIONS: '',
  OFFENCE_FLOW_ENABLED: 'false',
  DOWNLOAD_FMS_REQUEST_JSON_ENABLED: 'false',
  TECHNOLOGY_PORTAL_PILOT_PRISONS: '',
  SENTENCING_ACT_ENABLED: 'false',
}

Object.entries(defaultFeatureFlagEnv).forEach(([key, value]) => {
  process.env[key] = value
})
