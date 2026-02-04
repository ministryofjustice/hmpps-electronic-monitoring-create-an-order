import { Order } from '../../../models/Order'
import { ViewModel } from '../../../models/view-models/utils'
import { IsMappaInput } from './formModel'

type MappaViewModel = ViewModel<Omit<IsMappaInput, 'action'>>

const construct = (order: Order): MappaViewModel => {
  return {
    isMappa: { value: order.mappa?.isMappa ?? '' },
    errorSummary: null,
  }
}

export default { construct }
