import { AddressWithoutTypeUPRN } from '../../models/Address'

export interface PostcodeLookupClient {
  lookupByPostcode: (postcode: string) => Promise<AddressWithoutTypeUPRN[]>
  lookupByUPRN(uprn: string): Promise<AddressWithoutTypeUPRN>
}
