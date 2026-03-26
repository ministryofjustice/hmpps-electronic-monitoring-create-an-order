import { AddressWithoutTypeUPRN } from '../../../models/Address'
import { PostcodeLookupClient } from '../PostcodeLookupClient'
import AddressMapper from './addressMapper'
import { OSDataHubPostcodeResponse } from './osDataHubPostcodeResponse'
import RestClient from '../../restClient'

export default class OSDataHubClient implements PostcodeLookupClient {
  constructor(
    private readonly apiClient: RestClient,
    private readonly addressMapper: AddressMapper,
    private readonly apiKey: string,
  ) {}

  async lookupByPostcode(postcode: string): Promise<AddressWithoutTypeUPRN[]> {
    const results = await this.apiClient.getWithoutBearer({
      path: '/search/places/v1/postcode',
      query: `postcode=${postcode}&dataset=DPA`,
      headers: { key: this.apiKey || '' },
    })

    const data = results as OSDataHubPostcodeResponse

    return this.addressMapper.mapToAddresses(data)
  }

  async lookupByUPRN(uprn: string): Promise<AddressWithoutTypeUPRN> {
    const results = await this.apiClient.getWithoutBearer({
      path: '/search/places/v1/uprn',
      query: `uprn=${uprn}`,
      headers: { key: this.apiKey || '' },
    })

    const data = results as OSDataHubPostcodeResponse

    return this.addressMapper.mapToAddresses(data)[0]
  }
}
