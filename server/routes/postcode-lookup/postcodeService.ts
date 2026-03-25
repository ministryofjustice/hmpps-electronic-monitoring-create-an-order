import { ValidationResult } from '../../models/Validation'
import { FindAddressForm, FindAddressValidator } from './find-address/formModel'
import { convertZodErrorToValidationError } from '../../utils/errors'
import { AddressType, AddressWithoutTypeUPRN, AddressWithUPRN } from '../../models/Address'
import { PostcodeLookupClient } from '../../data/postcode/PostcodeLookupClient'

export default class PostcodeService {
  constructor(private readonly client: PostcodeLookupClient) {}

  async lookupByPostcode(postcode: string, addressType: AddressType, buildingId?: string): Promise<AddressWithUPRN[]> {
    const data = await this.client.lookupByPostcode(this.normalisePostcode(postcode))
    let addresses = data.map((address): AddressWithUPRN => {
      return { ...address, addressType }
    })

    if (buildingId) {
      addresses = addresses.filter(address => address.addressLine1.includes(buildingId))
    }

    return addresses
  }

  async lookupByUPRN(uprn: string): Promise<AddressWithoutTypeUPRN> {
    return this.client.lookupByUPRN(uprn)
  }

  private normalisePostcode(postcode: string): string {
    return postcode.replace(' ', '')
  }

  validateFindAddressData = (data: FindAddressForm): FindAddressForm | ValidationResult => {
    const result = FindAddressValidator.safeParse(data)

    if (!result.success) {
      return convertZodErrorToValidationError(result.error)
    }

    return data
  }
}
