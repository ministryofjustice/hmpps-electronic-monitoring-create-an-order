import { Order } from '../../../models/Order'
import { ViewModel } from '../../../models/view-models/utils'
import { ValidationResult } from '../../../models/Validation'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { isStandardCurfewSchedule } from '../../../utils/standardCurfewTimes'

export type CurfewTimetableQuestionViewModel = ViewModel<{
  standardCurfewTimes: string
}>

const constructModel = (order: Order, errors: ValidationResult): CurfewTimetableQuestionViewModel => {
  const { curfewTimeTable } = order
  let standardCurfewTimesAnswer = ''
  if (curfewTimeTable && curfewTimeTable.length) {
    standardCurfewTimesAnswer = isStandardCurfewSchedule(curfewTimeTable, order.curfewConditions?.curfewAddress)
      ? 'YES'
      : 'NO'
  }

  const model: CurfewTimetableQuestionViewModel = {
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
