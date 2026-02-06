import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { IsMappaInput } from './formModel'

type MappaViewModel = ViewModel<Omit<IsMappaInput, 'action'>>

const construct = (order: Order, errors: ValidationResult): MappaViewModel => {
  return {
    isMappa: { value: order.mappa?.isMappa ?? '', error: getError(errors, 'isMappa') },
    errorSummary: createGovukErrorSummary(errors),
  }
}

export default { construct }
