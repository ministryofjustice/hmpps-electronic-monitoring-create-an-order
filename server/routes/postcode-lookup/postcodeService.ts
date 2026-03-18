import { ValidationResult } from '../../models/Validation'
import { FindAddressForm, FindAddressValidator } from './find-address/formModel'
import { convertZodErrorToValidationError } from '../../utils/errors'
import { AddressWithoutType } from '../../models/Address'
import { PostcodeLookupClient } from '../../data/postcode/postcodeClient'

export default class PostcodeService {
  constructor(private readonly client: PostcodeLookupClient) {}

  async lookupPostcode(postcode: string): Promise<AddressWithoutType[]> {
    return this.client.lookup(postcode)
  }

  validateFindAddressData = (data: FindAddressForm): FindAddressForm | ValidationResult => {
    const result = FindAddressValidator.safeParse(data)

    if (!result.success) {
      return convertZodErrorToValidationError(result.error)
    }

    return data
  }
}
