import { Order } from '../../../models/Order'
import { ViewModel } from '../../../models/view-models/utils'
import { MappaInput } from './formModel'

type MappaViewModel = ViewModel<Omit<MappaInput, 'action'>>

const construct = (order: Order): MappaViewModel => {
  return {
    level: {
      value: order.installationAndRisk?.mappaLevel || '',
    },
    category: {
      value: order.installationAndRisk?.mappaCaseType || '',
    },
    errorSummary: null,
  }
}

export default { construct }
