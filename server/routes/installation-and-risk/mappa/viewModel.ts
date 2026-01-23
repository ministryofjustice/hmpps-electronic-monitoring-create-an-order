import { Order } from '../../../models/Order'
import { ViewModel } from '../../../models/view-models/utils'
import { MappaInput } from './formModel'

type MappaViewModel = ViewModel<Omit<MappaInput, 'action'>>

const construct = (order: Order): MappaViewModel => {
  return {
    level: {
      value: '',
    },
    category: {
      value: '',
    },
    errorSummary: null,
  }
}

export default { construct }
