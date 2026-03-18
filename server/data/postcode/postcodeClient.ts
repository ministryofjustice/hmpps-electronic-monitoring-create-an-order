import { AddressWithoutType } from '../../models/Address'

export interface PostcodeLookupClient {
  lookup: (postcode: string) => Promise<AddressWithoutType[]>
}
