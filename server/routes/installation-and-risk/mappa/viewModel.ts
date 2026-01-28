import { Order } from '../../../models/Order'
import { ViewModel } from '../../../models/view-models/utils'
import { MappaInput } from './formModel'

type MappaViewModel = ViewModel<Omit<MappaInput, 'action'>>

const construct = (order: Order): MappaViewModel => {
  return {
    level: {
      value: order.mappa?.level || '',
    },
    category: {
      value: order.mappa?.category || '',
    },
    errorSummary: null,
  }
}

export default { construct }
