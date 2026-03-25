import { AddressWithoutTypeUPRN } from '../../models/Address'

export interface PostcodeLookupClient {
  lookup: (postcode: string) => Promise<AddressWithoutTypeUPRN[]>
}
