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

const MONITORING_TYPE_KEYS = [
  'curfewConditions',
  'enforcementZoneConditions',
  'monitoringConditionsTrail',
  'mandatoryAttendanceConditions',
  'monitoringConditionsAlcohol',
] as const

type MonitoringKey = (typeof MONITORING_TYPE_KEYS)[number]

export type MonitoringTypeText =
  | 'Curfew'
  | 'Mandatory attendance monitoring'
  | 'Trail monitoring'
  | 'Exclusion zone monitoring'
  | 'Alcohol monitoring'

const MONITORING_KEY_TO_TYPE: Record<MonitoringKey, MonitoringTypeText> = {
  curfewConditions: 'Curfew',
  enforcementZoneConditions: 'Exclusion zone monitoring',
  monitoringConditionsTrail: 'Trail monitoring',
  mandatoryAttendanceConditions: 'Mandatory attendance monitoring',
  monitoringConditionsAlcohol: 'Alcohol monitoring',
}

export type MonitoringTypeData = {
  type: MonitoringTypeText
  monitoringType: MonitoringType
}

export const findMonitoringTypeById = (order: Order, monitoringTypeId: string): MonitoringTypeData | undefined => {
  const allPossibleMatches = MONITORING_TYPE_KEYS.map(key => {
    const propertyValue = order[key]

    if (!propertyValue) {
      return undefined
    }

    let match: MonitoringType | undefined

    if (Array.isArray(propertyValue)) {
      match = propertyValue.find(type => type.id === monitoringTypeId)
    } else if (propertyValue.id === monitoringTypeId) {
      match = propertyValue
    }

    if (match) {
      return {
        type: MONITORING_KEY_TO_TYPE[key],
        monitoringType: match,
      }
    }

    return undefined
  })

  return allPossibleMatches.find(item => item !== undefined)
}

export default findMonitoringTypeById
