import { Offence } from '../../../models/Offence'
import { Order } from '../../../models/Order'
import { DateTimeField, ViewModel } from '../../../models/view-models/utils'
import { deserialiseDateTime } from '../../../utils/utils'

type OffenceViewModel = ViewModel<Pick<Offence, 'offenceType'>> & {
  offenceDate: DateTimeField
  showDate: boolean
}

const contructFromOrder = (order: Order, offence: Offence | undefined, showDate: boolean): OffenceViewModel => {
  return {
    offenceType: {
      value: offence?.offenceType || '',
    },
    offenceDate: {
      value: deserialiseDateTime(offence?.offenceDate ?? null),
    },
    showDate,
    errorSummary: null,
  }
}

export default { contruct: contructFromOrder }
