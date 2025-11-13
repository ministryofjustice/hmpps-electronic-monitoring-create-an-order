import { AlcoholMonitoring } from '../../../models/AlcoholMonitoring'
import { AttendanceMonitoring } from '../../../models/AttendanceMonitoring'
import { CurfewConditions } from '../../../models/CurfewConditions'
import { EnforcementZone } from '../../../models/EnforcementZone'
import { TrailMonitoring } from '../../../models/TrailMonitoring'
import { createDatePreview } from '../../../utils/checkYourAnswers'

type RemoveMonitoringTypeViewModel = {
  monitoringTypeText: string
}

export type MonitoringType =
  | CurfewConditions
  | AttendanceMonitoring
  | TrailMonitoring
  | EnforcementZone
  | AlcoholMonitoring

export type MonitoringTypeData = {
  type:
    | 'Curfew'
    | 'Mandatory attendance monitoring'
    | 'Trail monitoring'
    | 'Exclusion zone monitoring'
    | 'Alcohol monitoring'
  monitoringType: MonitoringType
}

const construct = (input: MonitoringTypeData): RemoveMonitoringTypeViewModel => {
  const formattedStartDate = createDatePreview(input.monitoringType.startDate)
  const formattedEndDate = createDatePreview(input.monitoringType.endDate)

  return {
    monitoringTypeText: `${input.type} from ${formattedStartDate} to ${formattedEndDate}`,
  }
}

export default {
  construct,
}
