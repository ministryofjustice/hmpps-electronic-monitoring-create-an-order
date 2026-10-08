import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { DeviceWearer } from '../../../models/DeviceWearer'
import { NoFixedAbodeFormData } from './formModel'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'

type NoFixedAbodeViewModel = ViewModel<Pick<DeviceWearer, 'noFixedAbode'>>

const constructFromFormData = (
  formData: NoFixedAbodeFormData,
  validationErrors: ValidationResult,
): NoFixedAbodeViewModel => {
  return {
    noFixedAbode: {
      value: formData.noFixedAbode?.toString() ?? '',
      error: getError(validationErrors, 'noFixedAbode'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const constructFromEntity = (deviceWearer: DeviceWearer): NoFixedAbodeViewModel => {
  if (deviceWearer) {
    return {
      noFixedAbode: {
        value: deviceWearer.noFixedAbode?.toString() ?? 'null',
      },
      errorSummary: null,
    }
  }
  return {
    noFixedAbode: {
      value: '',
    },
    errorSummary: null,
  }
}

const construct = (
  deviceWearer: DeviceWearer,
  formData: NoFixedAbodeFormData,
  validationErrors: ValidationResult,
): NoFixedAbodeViewModel => {
  if (validationErrors.length > 0) {
    return constructFromFormData(formData, validationErrors)
  }

  return constructFromEntity(deviceWearer)
}

export default {
  construct,
}
