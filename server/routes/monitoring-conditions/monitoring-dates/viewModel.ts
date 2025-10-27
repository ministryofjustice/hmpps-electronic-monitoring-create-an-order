import { ValidationResult } from '../../../models/Validation'
import { ViewModel, ErrorsViewModel, DateField } from '../../../models/view-models/utils'
import { getError, getErrorsViewModel, deserialiseDateTime } from '../../../utils/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { MonitoringConditions } from '../model'

export type MonitoringDatesModel = ViewModel<unknown> & {
  startDate: DateField
  endDate: DateField
  errors: ErrorsViewModel
}

const constructModel = (data: MonitoringConditions, errors: ValidationResult): MonitoringDatesModel => {
  const model: MonitoringDatesModel = {
    startDate: {
      value: deserialiseDateTime(data.startDate),
      error: getError(errors, 'startDate'),
    },
    endDate: {
      value: deserialiseDateTime(data.endDate),
      error: getError(errors, 'endDate'),
    },
    errorSummary: null,
    errors: {},
  }

  if (errors && errors.length) {
    model.errorSummary = createGovukErrorSummary(errors)
    model.errors = getErrorsViewModel(errors)
  }

  return model
}

export default constructModel
