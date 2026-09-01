import { Order } from '../../../models/Order'
import { ViewModel } from '../../../models/view-models/utils'
import { ValidationResult } from '../../../models/Validation'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'

export type CurfewDayOfReleaseViewModel = ViewModel<{
  standardCurfewTimes: string
}>

const constructModel = (_order: Order, errors: ValidationResult): CurfewDayOfReleaseViewModel => {
  const model: CurfewDayOfReleaseViewModel = {
    standardCurfewTimes: { value: '' },
    errorSummary: null,
  }

  if (errors && errors.length) {
    model.standardCurfewTimes!.error = getError(errors, 'standardCurfewTimes')
    model.errorSummary = createGovukErrorSummary(errors)
  }

  return model
}

export default constructModel
