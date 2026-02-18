import { createDatePreview } from '../../../utils/checkYourAnswers'
import { MonitoringTypeData } from '../utils/monitoringTypes'

type RemoveMonitoringTypeViewModel = {
  monitoringTypeReadable: string
}

const construct = (input: MonitoringTypeData): RemoveMonitoringTypeViewModel => {
  const formattedStartDate = createDatePreview(input.monitoringType.startDate)
  const formattedEndDate = createDatePreview(input.monitoringType.endDate)

  return {
    monitoringTypeReadable: `${input.type} from ${formattedStartDate} to ${formattedEndDate}`,
  }
}

export default {
  construct,
}
