import { Offence } from '../../../models/Offence'
import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { DateField, ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { deserialiseDateTime, getError } from '../../../utils/utils'
import { OffenceInput } from './formModel'

type OffenceViewModel = ViewModel<Pick<OffenceInput, 'offenceType'>> & {
  offenceDate: DateField
  showDate: boolean
  isHomeOffice: boolean
}

const contructFromOrder = (
  order: Order,
  offence: Offence | undefined,
  showDate: boolean,
  isHomeOffice: boolean,
): OffenceViewModel => {
  return {
    offenceType: {
      value: offence?.offenceType || '',
    },
    offenceDate: {
      value: deserialiseDateTime(offence?.offenceDate),
    },
    showDate,
    isHomeOffice,
    errorSummary: null,
  }
}

const constructFromFormData = (
  formData: OffenceInput,
  errors: ValidationResult,
  showDate: boolean,
  isHomeOffice: boolean,
): OffenceViewModel => {
  return {
    offenceType: {
      value: formData?.offenceType || '',
      error: getError(errors, 'offenceType'),
    },
    offenceDate: {
      value: {
        day: formData.offenceDate?.day || '',
        month: formData.offenceDate?.month || '',
        year: formData.offenceDate?.year || '',
      },
      error: getError(errors, 'offenceDate'),
    },
    showDate,
    isHomeOffice,
    errorSummary: createGovukErrorSummary(errors),
  }
}

const construct = (
  order: Order,
  offence: Offence | undefined,
  showDate: boolean,
  formData: OffenceInput | undefined,
  errors: ValidationResult,
  isHomeOffice: boolean,
): OffenceViewModel => {
  if (errors.length > 0 && formData !== undefined) {
    return constructFromFormData(formData, errors, showDate, isHomeOffice)
  }
  return contructFromOrder(order, offence, showDate, isHomeOffice)
}

export default { construct }
