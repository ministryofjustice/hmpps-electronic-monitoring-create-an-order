import { AddressWithoutType } from '../../../models/Address'
import { PostcodeLookupClient } from '../PostcodeLookupClient'
import AddressMapper from './addressMapper'
import { OSDataHubPostcodeResponse } from './osDataHubPostcodeResponse'
import RestClient from '../../restClient'

export default class OSDataHubClient implements PostcodeLookupClient {
  private apiKey?: string

  constructor(
    private readonly apiClient: RestClient,
    private readonly addressMapper: AddressMapper,
  ) {
    this.apiKey = process.env.OS_PLACES_API_KEY
  }

  async lookup(postcode: string): Promise<AddressWithoutType[]> {
    const results = await this.apiClient.getWithoutBearer({
      path: '/search/places/v1/postcode',
      query: `postcode=${postcode}&dataset=DPA`,
      headers: { key: this.apiKey || '' },
    })

    const data = results as OSDataHubPostcodeResponse

    return this.addressMapper.mapToAddresses(data)
  }
}
