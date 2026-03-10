import { ValidationResult } from '../../models/Validation'
import { FindAddressForm, FindAddressValidator } from './find-address/formModel'
import { convertZodErrorToValidationError } from '../../utils/errors'

export default class PostcodeService {
  constructor() {}

  validateFindAddressData = (data: FindAddressForm): FindAddressForm | ValidationResult => {
    const result = FindAddressValidator.safeParse(data)

    if (!result.success) {
      return convertZodErrorToValidationError(result.error)
    }

    return data
  }
}
