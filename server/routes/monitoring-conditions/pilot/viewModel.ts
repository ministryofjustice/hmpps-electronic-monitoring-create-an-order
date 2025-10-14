import { ViewModel } from '../../../models/view-models/utils'
import { MonitoringConditions } from '../model'

export type OrderTypeModel = ViewModel<Pick<MonitoringConditions, 'pilot'>>

const constructModel = (data: MonitoringConditions): OrderTypeModel => {
  return {
    pilot: {
      value: data.pilot || '',
    },
    errorSummary: null,
  }
}

export default constructModel
