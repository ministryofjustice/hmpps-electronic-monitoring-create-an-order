import { Order } from '../../../models/Order'
import { ViewModel } from '../../../models/view-models/utils'
import { ValidationResult } from '../../../models/Validation'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { STANDARD_CURFEW_TIMES } from './standardCurfewTimes'

export type CurfewDayOfReleaseViewModel = ViewModel<{
  standardCurfewTimes: string
}>

const constructModel = (order: Order, errors: ValidationResult): CurfewDayOfReleaseViewModel => {
  const releaseDayTimes = order.curfewReleaseDateConditions
  const standardCurfewTimesAreSaved =
    releaseDayTimes?.startTime === `${STANDARD_CURFEW_TIMES.startHours}:${STANDARD_CURFEW_TIMES.startMinutes}:00` &&
    releaseDayTimes.endTime === `${STANDARD_CURFEW_TIMES.endHours}:${STANDARD_CURFEW_TIMES.endMinutes}:00`
  let standardCurfewTimesAnswer = ''
  if (releaseDayTimes) {
    standardCurfewTimesAnswer = standardCurfewTimesAreSaved ? 'YES' : 'NO'
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
