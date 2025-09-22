import MonitoringConditionsModel from './model'
import type { MonitoringConditions } from './model'
import MonitoringConditionsStore from './store/store'

export default class MonitoringConditionsStoreService {
  constructor(private readonly dataStore: MonitoringConditionsStore) {}

  public async updateMonitoringConditions(key: string, data: MonitoringConditions) {
    await this.dataStore.setMonitoringConditions(key, data, 24 * 60 * 60)
  }

  public async getMonitoringConditions(key: string) {
    let result = await this.dataStore.getMonitoringConditions(key)

    if (result === null) {
      result = JSON.stringify({})
    }

    const data = MonitoringConditionsModel.parse(JSON.parse(result))

    await this.dataStore.setMonitoringConditions(key, data, 24 * 60 * 60)

    return data
  }
}
