import { ViewModel } from '../../../models/view-models/utils'
import { MonitoringConditions } from '../model'

type OrderTypeModel = ViewModel<Pick<MonitoringConditions, 'orderType'>>

const contructModel = (data: MonitoringConditions): OrderTypeModel => {
  return { orderType: { value: data.orderType || '' }, errorSummary: null }
}

export default contructModel
