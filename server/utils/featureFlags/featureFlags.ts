type FeatureFlagMap = Record<string, boolean>

export default class FeatureFlags {
  private static instance: FeatureFlags

  private flags: FeatureFlagMap = {}

  private constructor() {
    this.flags = { ...this.loadFlagsFromEnv() }
  }

  static getInstance(): FeatureFlags {
    if (!FeatureFlags.instance) {
      FeatureFlags.instance = new FeatureFlags()
    }
    return FeatureFlags.instance
  }

  private loadFlagsFromEnv(): FeatureFlagMap {
    return {
      AUDIT_ENABLED: process.env.AUDIT_ENABLED === 'true',
      DATA_DICTIONARY_V5_1_ENABLED: process.env.DATA_DICTIONARY_V5_1_ENABLED === 'true',
      MAPPA_ENABLED: process.env.MAPPA_ENABLED === 'true',
    }
  }

  public get(flagName: string): boolean {
    if (!(flagName in this.flags)) {
      throw new Error(`Feature flag "${flagName}" not defined.`)
    }
    return this.flags[flagName]
  }

  public getAll(): Record<string, boolean> {
    return { ...this.flags }
  }

  public overwrite(flags: Record<string, boolean>): void {
    if (process.env.NODE_ENV === 'test') {
      this.flags = { ...flags }
    }
  }

  public reset(): void {
    this.flags = { ...this.loadFlagsFromEnv() }
  }
}
