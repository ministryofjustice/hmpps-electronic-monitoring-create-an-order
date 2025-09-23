import { NotifyingOrganisation } from '../../../models/NotifyingOrganisation'
import { Order } from '../../../models/Order'
import { ViewModel } from '../../../models/view-models/utils'
import { MonitoringConditions } from '../model'

export type OrderTypeModel = ViewModel<Pick<MonitoringConditions, 'orderType'>> & {
  orderTypeQuestions?: OrderTypeQuestion[]
}

type OrderTypeQuestion = {
  question: string
  hint: string
  value: string
}

const contructModel = (order: Order, data: MonitoringConditions): OrderTypeModel => {
  const model: OrderTypeModel = { orderType: { value: data.orderType || '' }, errorSummary: null }

  const notifyingOrg = order.interestedParties?.notifyingOrganisation
  if (notifyingOrg !== undefined) {
    model.orderTypeQuestions = getQuestions(notifyingOrg)
  }

  return model
}

const getQuestions = (notifyingOrg: NotifyingOrganisation) => {
  switch (notifyingOrg) {
    case 'PROBATION':
      return [
        {
          question: 'Release from prison',
          hint: 'Monitoring is a condition of being released from prison following a custodial sentence.',
          value: 'Post Release',
        },
        {
          question: 'Community',
          hint: 'Monitoring is a condition of a court order where they were convicted of a crime, but received a community rather than custodial sentence.',
          value: 'Community',
        },
      ]
    default:
      return []
  }
}

export default contructModel
