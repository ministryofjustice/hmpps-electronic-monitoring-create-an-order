import MonitoringConditionsModel from './model'
import type { MonitoringConditions } from './model'
import MonitoringConditionsStore from './store/store'

export default class MonitoringConditionsStoreService {
  constructor(private readonly dataStore: MonitoringConditionsStore) {}

  public async updateMonitoringConditions(key: string, data: MonitoringConditions) {
    await this.dataStore.setMonitoringConditions(key, data, 24 * 60 * 60)
  }

  public async getMonitoringConditions(key: string): Promise<MonitoringConditions> {
    let result = await this.dataStore.getMonitoringConditions(key)

    if (result === null) {
      result = JSON.stringify({})
    }

    const data = MonitoringConditionsModel.parse(JSON.parse(result))

    await this.dataStore.setMonitoringConditions(key, data, 24 * 60 * 60)

    return data
  }

  public async updateOrderType(key: string, data: Pick<MonitoringConditions, 'orderType'>) {
    const monitoringConditions = await this.getMonitoringConditions(key)
    monitoringConditions.orderType = data.orderType

    switch (data.orderType) {
      case 'POST_RELEASE':
        monitoringConditions.conditionType = 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER'
        break
      case 'COMMUNITY':
        monitoringConditions.conditionType = 'REQUIREMENT_OF_A_COMMUNITY_ORDER'
        break
      case 'CIVIL':
      case 'IMMIGRATION':
      case 'BAIL':
        monitoringConditions.conditionType = 'BAIL_ORDER'
        break
      default:
        throw new Error('Invalid order type')
    }

    await this.updateMonitoringConditions(key, monitoringConditions)
  }
}
