import { Offence } from '../../../models/Offence'
import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { DateField } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import { deserialiseDateTime, getError } from '../../../utils/utils'
import { OffenceInput } from './formModel'

type OffenceItemViewModel = {
  offenceType: { value: string; error?: ReturnType<typeof getError> }
  offenceDate: DateField
}

type OffenceViewModel = {
  offences: OffenceItemViewModel[]
  showDate: boolean
  isHomeOffice: boolean
  errorSummary: ReturnType<typeof createGovukErrorSummary>
}

const emptyDate = (): DateField => ({ value: { day: '', month: '', year: '' } })

const contructFromOrder = (
  order: Order,
  currentOffence: Offence | undefined,
  showDate: boolean,
  isHomeOffice: boolean,
): OffenceViewModel => {
  const offences: OffenceItemViewModel[] = !showDate
    ? (order.offences || []).map(o => ({
        offenceType: { value: o.offenceType || '' },
        offenceDate: { value: deserialiseDateTime(o.offenceDate) },
      }))
    : [
        {
          offenceType: { value: currentOffence?.offenceType || '' },
          offenceDate: { value: deserialiseDateTime(currentOffence?.offenceDate) },
        },
      ]

  return { offences, showDate, isHomeOffice, errorSummary: null }
}

const constructFromFormData = (
  formData: OffenceInput,
  errors: ValidationResult,
  showDate: boolean,
  isHomeOffice: boolean,
): OffenceViewModel => {
  let offences: OffenceItemViewModel[]

  if (!showDate) {
    const selected = formData.offences ?? []
    offences = (selected.length ? selected : ['']).map(value => ({
      offenceType: { value },
      offenceDate: emptyDate(),
    }))
    offences[0].offenceType.error = getError(errors, 'offences')
  } else {
    offences = [
      {
        offenceType: { value: formData?.offenceType || '', error: getError(errors, 'offenceType') },
        offenceDate: {
          value: {
            day: formData.offenceDate?.day || '',
            month: formData.offenceDate?.month || '',
            year: formData.offenceDate?.year || '',
          },
          error: getError(errors, 'offenceDate'),
        },
      },
    ]
  }

  return { offences, showDate, isHomeOffice, errorSummary: createGovukErrorSummary(errors) }
}

const construct = (
  order: Order,
  offence: Offence | undefined,
  showDate: boolean,
  formData: OffenceInput | undefined,
  errors: ValidationResult,
): OffenceViewModel => {
  const isHomeOffice = order.interestedParties?.notifyingOrganisation === 'HOME_OFFICE'

  if (errors.length > 0 && formData !== undefined) {
    return constructFromFormData(formData, errors, showDate, isHomeOffice)
  }
  return contructFromOrder(order, offence, showDate, isHomeOffice)
}

export default { construct }
