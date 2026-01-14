import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { deserialiseDateTime, getError } from '../../../utils/utils'
import { Dapo } from './formModel'

type DapoModel = ViewModel<Omit<Dapo, 'action'>>

const contructFromOrder = (order: Order, dapoId: string, errors: ValidationResult): DapoModel => {
  const matchingDapo = order.dapoClauses?.find(dapoClause => dapoClause.id === dapoId)
  return {
    clause: {
      value: matchingDapo?.clause ?? '',
      error: getError(errors, 'clause'),
    },
    date: {
      value: deserialiseDateTime(matchingDapo?.date),
      error: getError(errors, 'date'),
    },
    errorSummary: createGovukErrorSummary(errors),
  }
}

export default { contructFromOrder }
