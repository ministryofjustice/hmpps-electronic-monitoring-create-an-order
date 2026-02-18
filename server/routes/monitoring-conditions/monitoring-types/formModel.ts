import { z } from 'zod'
import { MonitoringTypesEnum } from '../model'

const processMonitoringTypes = (value: unknown) => {
  if (value === undefined || value === null) {
    return []
  }
  if (typeof value === 'string') {
    return [value]
  }
  if (Array.isArray(value)) {
    return value
  }
  return []
}

export type MonitoringType = z.infer<typeof MonitoringTypesEnum>
type MonitoringTypesBooleans = { [k in MonitoringType]: boolean }

const MonitoringTypesFormDataModel = z
  .object({
    action: z.string(),
    monitoringTypes: z.preprocess(processMonitoringTypes, z.array(MonitoringTypesEnum)),
  })
  .transform(originalData => {
    const { monitoringTypes, ...rest } = originalData

    const monitoringTypeBools: MonitoringTypesBooleans = {
      curfew: false,
      exclusionZone: false,
      trail: false,
      mandatoryAttendance: false,
      alcohol: false,
    }

    monitoringTypes.forEach(type => {
      if (type in monitoringTypeBools) {
        monitoringTypeBools[type] = true
      }
    })

    return {
      ...rest,
      ...monitoringTypeBools,
    }
  })

export default MonitoringTypesFormDataModel
