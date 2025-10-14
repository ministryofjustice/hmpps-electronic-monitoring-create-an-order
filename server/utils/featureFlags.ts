import fs from 'fs'
import path from 'path'

type FeatureFlagMap = Record<string, boolean | string>

const featureFlagFilePath = path.join(process.cwd(), 'data', 'feature-flags.json')
const defaultFeatureFlagFilePath = path.join(process.cwd(), 'data', 'default-feature-flags.json')

export default class FeatureFlags {
  private static instance: FeatureFlags

  private constructor() {
    const flags = { ...this.loadFlagsFromEnv() }
    this.writeFlagsToFile(featureFlagFilePath, flags)
    this.writeFlagsToFile(defaultFeatureFlagFilePath, flags)
  }

  static getInstance(): FeatureFlags {
    if (!FeatureFlags.instance) {
      FeatureFlags.instance = new FeatureFlags()
    }
    return FeatureFlags.instance
  }

  private loadFlagsFromEnv(): FeatureFlagMap {
    return {
      MAPPA_ENABLED: process.env.MAPPA_ENABLED === 'true',
      MONITORING_CONDITION_TIMES_ENABLED: process.env.MONITORING_CONDITION_TIMES_ENABLED === 'true',
      VARIATION_AS_NEW_ORDER_ENABLED: process.env.VARIATION_AS_NEW_ORDER_ENABLED === 'true',
      ORDER_TYPE_ENABLED: process.env.ORDER_TYPE_ENABLED === 'true',
      ALCOHOL_MONITORING_ENABLED: process.env.ALCOHOL_MONITORING_ENABLED === 'true',
      CREATE_NEW_ORDER_VERSION_ENABLED: process.env.CREATE_NEW_ORDER_VERSION_ENABLED === 'true',
      TAG_AT_SOURCE_PILOT_PRISONS: process.env.TAG_AT_SOURCE_PILOT_PRISONS ?? '',
    }
  }

  private writeFlagsToFile(filePath: string, flags: Record<string, boolean | string>) {
    const jsonString = JSON.stringify(flags, null, 2)
    fs.writeFileSync(filePath, jsonString, 'utf-8')
  }

  public getAll(): Record<string, boolean> {
    return JSON.parse(fs.readFileSync(featureFlagFilePath, 'utf-8'))
  }

  public get(flagName: string): boolean {
    const flags = this.getAll()
    if (!(flagName in flags)) {
      throw new Error(`Feature flag "${flagName}" not defined.`)
    }
    return flags[flagName]
  }

  public getValue(flagName: string): string {
    const flags = JSON.parse(fs.readFileSync(featureFlagFilePath, 'utf-8'))
    if (!(flagName in flags)) {
      throw new Error(`Feature flag "${flagName}" not defined.`)
    }
    return flags[flagName]
  }
}
