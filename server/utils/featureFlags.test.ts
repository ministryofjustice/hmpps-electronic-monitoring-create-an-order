/* eslint-disable @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-require-imports */

// NB: Intead of importing FeatureFlags at top of file, it's is imorted with require() in each test so that the module is re-evaluated at the start of each test. This is required for tests checking the behaviour of the module on instantiation.

import path from 'path'
import fs from 'fs'

const featureFlagFilePath = path.join(process.cwd(), 'data', 'feature-flags.json')
const defaultFeatureFlagFilePath = path.join(process.cwd(), 'data', 'default-feature-flags.json')

const mockFlags = {
  MAPPA_ENABLED: true,
  MONITORING_CONDITION_TIMES_ENABLED: false,
  VARIATION_AS_NEW_ORDER_ENABLED: true,
  ORDER_TYPE_ENABLED: false,
  CREATE_NEW_ORDER_VERSION_ENABLED: false,
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

    const mappaFlag = FeatureFlags.getInstance().get('MAPPA_ENABLED')

    expect(mappaFlag).toBe(true)
  })

  test('get should throw if flag is not defined', () => {
    const FeatureFlags = require('./featureFlags').default
    const flags = FeatureFlags.getInstance()

    expect(() => flags.get('UNKNOWN_FLAG')).toThrow('Feature flag "UNKNOWN_FLAG" not defined.')
  })
})
