import { ValidationResult } from '../../models/Validation'
import { FindAddressForm, FindAddressValidator } from './find-address/formModel'
import { convertZodErrorToValidationError } from '../../utils/errors'
import { Address, AddressType } from '../../models/Address'
import { PostcodeLookupClient } from '../../data/postcode/PostcodeLookupClient'

export default class PostcodeService {
  constructor(private readonly client: PostcodeLookupClient) {}

  async lookupPostcode(postcode: string, addressType: AddressType): Promise<Address[]> {
    const addresses = await this.client.lookup(this.normalisePostcode(postcode))
    return addresses.map((address): Address => {
      return { ...address, addressType }
    })
  }

  validateFindAddressData = (data: FindAddressForm): FindAddressForm | ValidationResult => {
    const result = FindAddressValidator.safeParse(data)

    if (!result.success) {
      return convertZodErrorToValidationError(result.error)
    }

    return data
  }

  private normalisePostcode(postcode: string): string {
    return postcode.replace(' ', '')
  }
}
