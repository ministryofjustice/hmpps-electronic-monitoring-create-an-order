import { convertBooleanToEnum, getErrorsViewModel } from '../../utils/utils'
import { DeviceWearer } from '../DeviceWearer'
import { DeviceWearerFormData } from '../form-data/deviceWearer'
import { ValidationResult } from '../Validation'

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
})

const createViewModelFromFormData = (formData: DeviceWearerFormData, errors: ValidationResult) => ({
  ...formData,
  errors: getErrorsViewModel(errors),
})

const createViewModel = (deviceWearer: DeviceWearer, formData: DeviceWearerFormData, errors: ValidationResult) => {
  if (errors.length > 0) {
    return createViewModelFromFormData(formData, errors)
  }

  return createViewModelFromDeviceWearer(deviceWearer)
}

export default createViewModel
