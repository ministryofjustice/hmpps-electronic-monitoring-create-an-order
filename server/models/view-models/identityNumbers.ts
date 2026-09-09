import { IdentityNumberFieldName, getIdentityNumbers, identityNumberFieldNames } from '../../constants/identityNumbers'
import { createGovukErrorSummary } from '../../utils/errors'
import { ErrorSummary } from '../../utils/govukFrontEndTypes/errorSummary'
import { getError } from '../../utils/utils'
import { DeviceWearer, IdentityNumberType } from '../DeviceWearer'
import { IdentityNumbersFormData } from '../form-data/deviceWearer'
import { Order } from '../Order'
import { Cohort } from '../UserCohort'
import { ValidationResult } from '../Validation'
import { ErrorMessage } from './utils'

export type IdentityNumberField = {
  type: IdentityNumberType
  name: IdentityNumberFieldName
  value: string
  checked: boolean
  error?: ErrorMessage
}

type IdentityNumbersViewModel = {
  identityNumbers: {
    values: IdentityNumberType[]
    error?: ErrorMessage
  }
  identityNumberFields: IdentityNumberField[]
  isSingleIdentityNumber: boolean
  errorSummary: ErrorSummary | null
}

const createFields = (
  availableIdentityNumbers: IdentityNumberType[],
  selected: IdentityNumberType[],
  values: Partial<Record<IdentityNumberFieldName, string | null>>,
  validationErrors: ValidationResult,
): IdentityNumberField[] =>
  availableIdentityNumbers.map(type => {
    const name = identityNumberFieldNames[type]

    return {
      type,
      name,
      value: values[name] || '',
      checked: selected.includes(type),
      error: getError(validationErrors, name),
    }
  })

const selectedFromEntity = (
  deviceWearer: DeviceWearer,
  availableIdentityNumbers: IdentityNumberType[],
): IdentityNumberType[] =>
  availableIdentityNumbers.filter(type => Boolean(deviceWearer[identityNumberFieldNames[type]]))

const construct = (
  order: Order,
  cohort: Cohort | undefined,
  formData: IdentityNumbersFormData,
  validationErrors: ValidationResult,
): IdentityNumbersViewModel => {
  const availableIdentityNumbers = getIdentityNumbers(cohort, order.interestedParties?.notifyingOrganisation)

  const useFormData = validationErrors.length > 0
  const selected = useFormData
    ? formData.identityNumbers
    : selectedFromEntity(order.deviceWearer, availableIdentityNumbers)
  const values = useFormData ? formData : order.deviceWearer

  return {
    identityNumbers: {
      values: selected,
      error: getError(validationErrors, 'identityNumbers'),
    },
    identityNumberFields: createFields(availableIdentityNumbers, selected, values, validationErrors),
    isSingleIdentityNumber: availableIdentityNumbers.length === 1,
    errorSummary: useFormData ? createGovukErrorSummary(validationErrors) : null,
  }
}

export default {
  construct,
}
