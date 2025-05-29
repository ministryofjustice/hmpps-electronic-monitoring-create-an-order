import fs from 'fs'
import path from 'path'

type FeatureFlagMap = Record<string, boolean>

const featureFlagDir = path.join(process.cwd(), 'data')
const featureFlagFilePath = path.join(featureFlagDir, 'feature-flags.json')
const defaultFeatureFlagFilePath = path.join(featureFlagDir, 'default-feature-flags.json')

// Create data dirctory and feature flag files (if they don't already exist) before the class is instantiated.
if (!fs.existsSync(featureFlagDir)) {
  fs.mkdirSync(featureFlagDir)
}
if (!fs.existsSync(featureFlagFilePath)) {
  fs.writeFileSync(featureFlagFilePath, '{}', 'utf-8')
}
if (!fs.existsSync(defaultFeatureFlagFilePath)) {
  fs.writeFileSync(defaultFeatureFlagFilePath, '{}', 'utf-8')
}

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
      DD_V5_1_ENABLED: process.env.DD_V5_1_ENABLED === 'true',
      MAPPA_ENABLED: process.env.MAPPA_ENABLED === 'true',
      MONITORING_CONDITION_TIMES_ENABLED: process.env.MONITORING_CONDITION_TIMES_ENABLED === 'true',
      VARIATIONS_ENABLED: process.env.VARIATIONS_ENABLED === 'true',
    }
  }

  private writeFlagsToFile(filePath: string, flags: Record<string, boolean>) {
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
}
