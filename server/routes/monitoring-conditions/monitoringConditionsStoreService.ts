import { Order } from '../../models/Order'
import MonitoringConditionsModel from './model'
import type { MonitoringConditions } from './model'
import Store from './store/store'

export default class MonitoringConditionsStoreService {
  constructor(private readonly dataStore: Store) {}

  private keyFromOrder(order: Order): string {
    return `${order.id}+${order.versionId}`
  }

  public async updateMonitoringConditions(order: Order, data: MonitoringConditions) {
    await this.dataStore.set(this.keyFromOrder(order), JSON.stringify(data), 24 * 60 * 60)
  }

  public async getMonitoringConditions(order: Order): Promise<MonitoringConditions> {
    const key = this.keyFromOrder(order)
    let result = await this.dataStore.get(key)

    if (result === null) {
      result = JSON.stringify({})
    }
    await this.dataStore.set(key, result, 24 * 60 * 60)

    const data = MonitoringConditionsModel.parse(JSON.parse(result))

    return data
  }

  public async updateField<T extends keyof MonitoringConditions>(
    order: Order,
    field: T,
    data: MonitoringConditions[T],
  ) {
    const monitoringConditions = await this.getMonitoringConditions(order)
    monitoringConditions[field] = data
    await this.updateMonitoringConditions(order, monitoringConditions)
  }

  public async updateOrderType(order: Order, data: Pick<MonitoringConditions, 'orderType'>) {
    const monitoringConditions = await this.getMonitoringConditions(order)
    const previousOrderType = monitoringConditions.orderType
    monitoringConditions.orderType = data.orderType

    const goesToSentencePage = data.orderType ? ['POST_RELEASE', 'COMMUNITY', 'BAIL'].includes(data.orderType) : false

    if (!goesToSentencePage && previousOrderType !== data.orderType) {
      monitoringConditions.sentenceType = undefined
      monitoringConditions.hdc = undefined
      monitoringConditions.pilot = undefined
    }

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

    await this.updateMonitoringConditions(order, monitoringConditions)
  }

  public async updateSentenceType(order: Order, data: Pick<MonitoringConditions, 'sentenceType'>) {
    const monitoringConditions = await this.getMonitoringConditions(order)
    monitoringConditions.sentenceType = data.sentenceType

    if (monitoringConditions.orderType === 'POST_RELEASE') {
      if (data.sentenceType === 'SECTION_91') {
        monitoringConditions.hdc = 'YES'
      } else {
        monitoringConditions.hdc = 'NO'
      }
    }

    await this.updateMonitoringConditions(order, monitoringConditions)
  }

  public async updateMonitoringType(
    order: Order,
    data: Pick<MonitoringConditions, 'curfew' | 'exclusionZone' | 'trail' | 'mandatoryAttendance' | 'alcohol'>,
  ) {
    const monitoringConditions = await this.getMonitoringConditions(order)

    monitoringConditions.curfew = data.curfew
    monitoringConditions.exclusionZone = data.exclusionZone
    monitoringConditions.trail = data.trail
    monitoringConditions.mandatoryAttendance = data.mandatoryAttendance
    monitoringConditions.alcohol = data.alcohol

    await this.updateMonitoringConditions(order, monitoringConditions)
  }
}
