import fs from 'fs'
import path from 'path'

type FeatureFlagMap = {
  DD_VERSION: string
  MAPPA_ENABLED: boolean
  MONITORING_CONDITION_TIMES_ENABLED: boolean
  VARIATIONS_ENABLED: boolean
}

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
    const fallbackDDVersion = '4'
    return {
      DD_VERSION: process.env.DD_VERSION || fallbackDDVersion,
      MAPPA_ENABLED: process.env.MAPPA_ENABLED === 'true',
      MONITORING_CONDITION_TIMES_ENABLED: process.env.MONITORING_CONDITION_TIMES_ENABLED === 'true',
      VARIATIONS_ENABLED: process.env.VARIATIONS_ENABLED === 'true',
    }
  }

  private writeFlagsToFile(filePath: string, flags: Record<string, string | boolean>) {
    const jsonString = JSON.stringify(flags, null, 2)
    fs.writeFileSync(filePath, jsonString, 'utf-8')
  }

  public getAll(): FeatureFlagMap {
    return JSON.parse(fs.readFileSync(featureFlagFilePath, 'utf-8'))
  }

  public get<key extends keyof FeatureFlagMap>(flagName: key): FeatureFlagMap[key] {
    const flags = this.getAll()

    if (!(flagName in flags)) {
      throw new Error(`Feature flag "${flagName}" not defined.`)
    }

    return flags[flagName] as FeatureFlagMap[key]
  }
}
