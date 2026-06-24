import { Offence } from '../../../models/Offence'
import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { DateField, ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { deserialiseDateTime, getError } from '../../../utils/utils'
import { OffenceInput } from './formModel'

type OffenceInputItem = NonNullable<OffenceInput['offences']>[number]

export type OffenceItemViewModel = Omit<ViewModel<Pick<OffenceInputItem, 'offenceType'>>, 'errorSummary'> & {
  offenceDate: DateField
}

export type OffenceViewModel = {
  offences: OffenceItemViewModel[]
  showDate: boolean
  isHomeOffice: boolean
  errorSummary: ReturnType<typeof createGovukErrorSummary> | null
}

const constructFromOrder = (
  order: Order,
  offences: Offence[],
  showDate: boolean,
  isHomeOffice: boolean,
): OffenceViewModel => {
  return {
    offences: offences.map(offence => ({
      offenceType: {
        value: offence?.offenceType || '',
      },
      offenceDate: {
        value: deserialiseDateTime(offence?.offenceDate),
      },
    })),
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
  const formOffences = formData?.offences || []

  return {
    offences: formOffences.map((offence, index) => ({
      offenceType: {
        value: offence?.offenceType || '',
        error: getError(errors, `offences[${index}].offenceType`),
      },
      offenceDate: {
        value: {
          day: offence?.offenceDate?.day || '',
          month: offence?.offenceDate?.month || '',
          year: offence?.offenceDate?.year || '',
        },
        error: getError(errors, `offences[${index}].offenceDate`),
      },
    })),
    showDate,
    isHomeOffice,
    errorSummary: createGovukErrorSummary(errors),
  }
}

const construct = (
  order: Order,
  offences: Offence[] | undefined,
  showDate: boolean,
  formData: OffenceInput | undefined,
  errors: ValidationResult,
): OffenceViewModel => {
  const isHomeOffice = order.interestedParties?.notifyingOrganisation === 'HOME_OFFICE'

  if (errors.length > 0 && formData !== undefined) {
    return constructFromFormData(formData, errors, showDate, isHomeOffice)
  }
  return constructFromOrder(order, offences || [], showDate, isHomeOffice)
}

export default { construct }
