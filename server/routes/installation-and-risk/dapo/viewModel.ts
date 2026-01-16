import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { deserialiseDateTime, getError } from '../../../utils/utils'
import { DapoInput } from './formModel'

type DapoModel = ViewModel<Omit<DapoInput, 'action'>>

const contructFromOrder = (
  order: Order,
  formData: DapoInput | undefined,
  errors: ValidationResult,
  dapoId: string,
): DapoModel => {
  const matchingDapo = order.dapoClauses?.find(dapoClause => dapoClause.id === dapoId)

  return {
    clause: {
      value: getValue(formData?.clause, matchingDapo?.clause || ''),
      error: getError(errors, 'clause'),
    },
    date: {
      value: getValue(formData?.date, deserialiseDateTime(matchingDapo?.date)),
      error: getError(errors, 'date'),
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

export default { contruct: contructFromOrder }
