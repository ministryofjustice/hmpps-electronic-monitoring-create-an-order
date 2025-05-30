/* eslint-disable @typescript-eslint/no-var-requires, global-require */
import path from 'path'
import fs from 'fs'

const featureFlagFilePath = path.join(process.cwd(), 'data', 'feature-flags.json')
const defaultFeatureFlagFilePath = path.join(process.cwd(), 'data', 'default-feature-flags.json')

// mockFlags are set to false because the flags are undefined in process.env when tests run, making them default to false. This works but isn't an ideal test scenario. It would be better to configure jest to use specific environment variables, or otherwise mock the flag values in process.env.
const mockFlags = {
  DD_V5_1_ENABLED: false,
  MAPPA_ENABLED: false,
  MONITORING_CONDITION_TIMES_ENABLED: false,
  VARIATIONS_ENABLED: false,
}

jest.mock('fs')
const mockFs = fs as jest.Mocked<typeof fs>
mockFs.writeFileSync.mockImplementation(() => {})
mockFs.readFileSync.mockImplementation(() => JSON.stringify(mockFlags))

describe('FeatureFlags', () => {
  test('Should act as a singleton', () => {
    const FeatureFlags = require('./featureFlags').default

    const instance1 = FeatureFlags.getInstance()
    const instance2 = FeatureFlags.getInstance()

    expect(instance1).toBe(instance2)
  })

  test('Should load flags from process.env and write to JSON files', () => {
    const FeatureFlags = require('./featureFlags').default

    FeatureFlags.getInstance()

    expect(mockFs.writeFileSync).toHaveBeenCalledWith(featureFlagFilePath, JSON.stringify(mockFlags, null, 2), 'utf-8')
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      defaultFeatureFlagFilePath,
      JSON.stringify(mockFlags, null, 2),
      'utf-8',
    )
  })

  test('getAll should return all flags', () => {
    const FeatureFlags = require('./featureFlags').default
    const flags = FeatureFlags.getInstance().getAll()

    expect(flags).toEqual(mockFlags)
  })

  test('get should return the specified flag', () => {
    const FeatureFlags = require('./featureFlags').default

    const dataDictionaryFlag = FeatureFlags.getInstance().get('DD_V5_1_ENABLED')
    const mappaFlag = FeatureFlags.getInstance().get('MAPPA_ENABLED')

    expect(dataDictionaryFlag).toBe(false)
    expect(mappaFlag).toBe(false)
  })

  test('get should throw if flag is not defined', () => {
    const FeatureFlags = require('./featureFlags').default
    const flags = FeatureFlags.getInstance()

    expect(() => flags.get('UNKNOWN_FLAG')).toThrow('Feature flag "UNKNOWN_FLAG" not defined.')
  })
})
