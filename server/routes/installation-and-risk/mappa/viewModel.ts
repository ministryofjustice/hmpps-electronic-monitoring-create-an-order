import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/validation/errors'
import { MappaInput } from './formModel'
import { getError } from '../../../utils/validation/errorMessages'

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
