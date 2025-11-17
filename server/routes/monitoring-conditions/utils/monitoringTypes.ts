import { AlcoholMonitoring } from '../../../models/AlcoholMonitoring'
import { AttendanceMonitoring } from '../../../models/AttendanceMonitoring'
import { CurfewConditions } from '../../../models/CurfewConditions'
import { EnforcementZone } from '../../../models/EnforcementZone'
import { Order } from '../../../models/Order'
import { TrailMonitoring } from '../../../models/TrailMonitoring'

export type MonitoringType =
  | CurfewConditions
  | AttendanceMonitoring
  | TrailMonitoring
  | EnforcementZone
  | AlcoholMonitoring

export type MonitoringTypeText =
  | 'Curfew'
  | 'Mandatory attendance monitoring'
  | 'Trail monitoring'
  | 'Exclusion zone monitoring'
  | 'Alcohol monitoring'

export type MonitoringTypeData = {
  type: MonitoringTypeText
  monitoringType: MonitoringType
}

const findMatchingCurfew = (order: Order, monitoringTypeId: string) =>
  order.curfewConditions?.id === monitoringTypeId ? order.curfewConditions : undefined

const findMatchingTrail = (order: Order, monitoringTypeId: string) =>
  order.monitoringConditionsTrail?.id === monitoringTypeId ? order.monitoringConditionsTrail : undefined

const findMatchingAlcohol = (order: Order, monitoringTypeId: string) =>
  order.monitoringConditionsAlcohol?.id === monitoringTypeId ? order.monitoringConditionsAlcohol : undefined

const findMatchingMandatoryAttendance = (order: Order, monitoringTypeId: string) =>
  order.mandatoryAttendanceConditions.find(condition => condition.id === monitoringTypeId)

const findMatchingExclusionZone = (order: Order, monitoringTypeId: string) =>
  order.enforcementZoneConditions.find(condition => condition.id === monitoringTypeId)

export const findMonitoringTypeById = (order: Order, monitoringTypeId: string): MonitoringTypeData | undefined => {
  const matchingStategies: {
    type: MonitoringTypeText
    find: (order: Order, id: string) => MonitoringType | undefined
  }[] = [
    { type: 'Curfew', find: findMatchingCurfew },
    { type: 'Trail monitoring', find: findMatchingTrail },
    { type: 'Alcohol monitoring', find: findMatchingAlcohol },
    { type: 'Mandatory attendance monitoring', find: findMatchingMandatoryAttendance },
    { type: 'Exclusion zone monitoring', find: findMatchingExclusionZone },
  ]

  const allMatches = matchingStategies.map(strategy => {
    const match = strategy.find(order, monitoringTypeId)
    if (match) {
      return {
        monitoringType: match,
        type: strategy.type,
      }
    }
    return undefined
  })

  return allMatches.find(match => match !== undefined)
}

export default findMonitoringTypeById
