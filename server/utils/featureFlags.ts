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
      VARIATION_AS_NEW_ORDER_ENABLED: process.env.VARIATION_AS_NEW_ORDER_ENABLED === 'true',
      ALCOHOL_MONITORING_ENABLED: process.env.ALCOHOL_MONITORING_ENABLED === 'true',
      CREATE_NEW_ORDER_VERSION_ENABLED: process.env.CREATE_NEW_ORDER_VERSION_ENABLED === 'true',
      LIST_MONITORING_CONDITION_FLOW_ENABLED: process.env.LIST_MONITORING_CONDITION_FLOW_ENABLED === 'true',
      POSTCODE_LOOKUP_ENABLED: process.env.POSTCODE_LOOKUP_ENABLED === 'true',
      SERVICE_REQUEST_TYPE_ENABLED: process.env.SERVICE_REQUEST_TYPE_ENABLED === 'true',
      TAG_AT_SOURCE_PILOT_PRISONS: process.env.TAG_AT_SOURCE_PILOT_PRISONS ?? '',
      DAPOL_PILOT_PROBATION_REGIONS: process.env.DAPOL_PILOT_PROBATION_REGIONS ?? '',
      LICENCE_VARIATION_PROBATION_REGIONS: process.env.LICENCE_VARIATION_PROBATION_REGIONS ?? '',
      OFFENCE_FLOW_ENABLED: process.env.OFFENCE_FLOW_ENABLED === 'true',
      DOWNLOAD_FMS_REQUEST_JSON_ENABLED: process.env.DOWNLOAD_FMS_REQUEST_JSON_ENABLED === 'true',
      INTERESTED_PARTIES_FLOW_ENABLED: process.env.INTERESTED_PARTIES_FLOW_ENABLED === 'true'
    }
  }

  async resetFeatureFlags() {
    return fs.promises.copyFile(defaultFeatureFlagFilePath, featureFlagFilePath).then(() => null)
  }

  private writeFlagsToFile(filePath: string, flags: Record<string, boolean | string>) {
    const jsonString = JSON.stringify(flags, null, 2)
    fs.writeFileSync(filePath, jsonString, 'utf-8')
  }

  public async setFlag(flagName: string, value: boolean) {
    return fs.promises
      .readFile(featureFlagFilePath, 'utf-8')
      .then(data => {
        const flags = JSON.parse(data) as Record<string, boolean | string>

        if (flagName in flags) {
          flags[flagName] = value
        }

        const jsonString = JSON.stringify(flags, null, 2)
        return fs.promises.writeFile(featureFlagFilePath, jsonString, 'utf-8')
      })
      .then(() => null)
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
