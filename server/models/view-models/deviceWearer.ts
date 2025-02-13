import { govukErrorSummary } from '../../utils/errors'
import { convertBooleanToEnum, getError, getErrorsViewModel } from '../../utils/utils'
import { DeviceWearer } from '../DeviceWearer'
import { DeviceWearerFormData } from '../form-data/deviceWearer'
import { Order } from '../Order'
import { ValidationResult } from '../Validation'
import { AppFormPage } from './utils'

const construct = (
  order: Order,
  formData: DeviceWearerFormData,
  validationErrors: ValidationResult,
): AppFormPage<
  Pick<
    DeviceWearer,
    | 'firstName'
    | 'lastName'
    | 'alias'
    | 'dateOfBirth'
    | 'adultAtTimeOfInstallation'
    | 'sex'
    | 'gender'
    | 'disabilities'
    | 'language'
    | 'interpreterRequired'
  >
> => {
  const firstName = validationErrors.length > 0 ? formData.firstName || '' : (order.deviceWearer?.firstName ?? '')

  const lastName = validationErrors.length > 0 ? formData.lastName || '' : (order.deviceWearer?.lastName ?? '')

  const alias = validationErrors.length > 0 ? formData.alias || '' : (order.deviceWearer?.alias ?? '')

  return {
    errorSummary: govukErrorSummary(validationErrors),
    fields: [
      {
        component: 'govukInput',
        args: {
          label: {
            text: 'First names',
          },
          classes: 'govuk-input--width-10',
          id: 'firstName',
          name: 'firstName',
          value: firstName,
          errorMessage: getError(validationErrors, 'firstName'),
          disabled: order.status === 'SUBMITTED',
        },
      },
      {
        component: 'govukInput',
        args: {
          label: {
            text: 'Last name',
          },
          classes: 'govuk-input--width-10',
          id: 'lastName',
          name: 'lastName',
          value: lastName,
          errorMessage: getError(validationErrors, 'lastName'),
          disabled: order.status === 'SUBMITTED',
        },
      },
      {
        component: 'govukInput',
        args: {
          label: {
            text: 'Preferred name or alias (optional)',
          },
          hint: {
            text: 'For example a nickname or alias the device wearer is also known as',
          },
          classes: 'govuk-input--width-10',
          id: 'alias',
          name: 'alias',
          value: alias,
          errorMessage: getError(validationErrors, 'lastName'),
          disabled: order.status === 'SUBMITTED',
        },
      },
    ],
  }
}

const deserialiseDate = (dateString: string | null) => {
  if (dateString === null || dateString === '') {
    return {
      day: '',
      month: '',
      year: '',
    }
  }

  const date = new Date(dateString)

  return {
    day: date.getDate().toString(),
    month: (date.getMonth() + 1).toString(),
    year: date.getFullYear().toString(),
  }
}

const createViewModelFromDeviceWearer = (deviceWearer: DeviceWearer) => ({
  ...deviceWearer,
  adultAtTimeOfInstallation: convertBooleanToEnum(deviceWearer.adultAtTimeOfInstallation, '', 'true', 'false'),
  dateOfBirth: deserialiseDate(deviceWearer.dateOfBirth),
  interpreterRequired: convertBooleanToEnum(deviceWearer.interpreterRequired, '', 'true', 'false'),
  errors: {},
  errorSummary: null,
})

const createViewModelFromFormData = (formData: DeviceWearerFormData, errors: ValidationResult) => ({
  ...formData,
  errors: getErrorsViewModel(errors),
  errorSummary: govukErrorSummary(errors),
})

const createViewModel = (deviceWearer: DeviceWearer, formData: DeviceWearerFormData, errors: ValidationResult) => {
  if (errors.length > 0) {
    return createViewModelFromFormData(formData, errors)
  }

  return createViewModelFromDeviceWearer(deviceWearer)
}

export default construct
