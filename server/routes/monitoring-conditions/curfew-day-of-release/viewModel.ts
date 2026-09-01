import { Order } from '../../../models/Order'
import { ViewModel } from '../../../models/view-models/utils'
import { ValidationResult } from '../../../models/Validation'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { isStandardCurfewTimes } from './standardCurfewTimes'

export type CurfewDayOfReleaseViewModel = ViewModel<{
  standardCurfewTimes: string
}>

const constructModel = (order: Order, errors: ValidationResult): CurfewDayOfReleaseViewModel => {
  const releaseDayTimes = order.curfewReleaseDateConditions
  let standardCurfewTimesAnswer = ''
  if (releaseDayTimes) {
    standardCurfewTimesAnswer = isStandardCurfewTimes(releaseDayTimes) ? 'YES' : 'NO'
  }

  const model: CurfewDayOfReleaseViewModel = {
    standardCurfewTimes: { value: standardCurfewTimesAnswer },
    errorSummary: null,
  }

  if (errors && errors.length) {
    model.standardCurfewTimes!.error = getError(errors, 'standardCurfewTimes')
    model.errorSummary = createGovukErrorSummary(errors)
  }

  return model
}

export default constructModel
