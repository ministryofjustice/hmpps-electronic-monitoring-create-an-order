import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { MappaInput } from './formModel'

type MappaViewModel = ViewModel<Omit<MappaInput, 'action'>>

const construct = (order: Order, formData: MappaInput | undefined, errors: ValidationResult): MappaViewModel => {
  return {
    level: {
      value: getValue(formData?.level, order.mappa?.level || ''),
      error: getError(errors, 'level'),
    },
    category: {
      value: getValue(formData?.category, order.mappa?.category || ''),
      error: getError(errors, 'category'),
    },
    errorSummary: createGovukErrorSummary(errors),
  }
}

const getValue = <T>(primary: T | null | undefined, fallback: T): T => {
  if (primary !== undefined && primary !== null) {
    return primary
  }
  return fallback
}

export default { construct }
