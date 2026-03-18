import superagent from 'superagent'
import { AddressWithoutType } from '../../../models/Address'
import { PostcodeLookupClient } from '../PostcodeLookupClient'
import AddressMapper from './addressMapper'
import { OSDataHubPostcodeResponse } from './osDataHubPostcodeResponse'

export default class OSDataHubClient implements PostcodeLookupClient {
  private apiKey?: string

  constructor(private readonly addressMapper: AddressMapper) {
    this.apiKey = process.env.OS_PLACES_API_KEY
  }

  async lookup(postcode: string): Promise<AddressWithoutType[]> {
    const results = await superagent
      .get('https://api.os.uk/search/places/v1/postcode?')
      .query(`postcode=${postcode}&dataset=DPA`)
      .set({ key: this.apiKey })
      .timeout(10000)

    const data = results.body as OSDataHubPostcodeResponse

    return this.addressMapper.mapToAddresses(data)
  }
}
