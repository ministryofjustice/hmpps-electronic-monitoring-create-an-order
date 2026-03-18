import superagent from 'superagent'
import { AddressWithoutType } from '../../../models/Address'
import { PostcodeLookupClient } from '../postcodeClient'
import { OSDataHubAddress, OSDataHubPostcodeResponse } from './OSDataHubPostcodeResponse'

export default class OSDataHubClient implements PostcodeLookupClient {
  private apiKey?: string
  constructor() {
    this.apiKey = process.env.OS_PLACES_API_KEY
  }

  async lookup(postcode: string): Promise<AddressWithoutType[]> {
    const results = await superagent
      .get('https://api.os.uk/search/places/v1/postcode?')
      .query(`postcode=${postcode}&dataset=DPA`)
      .set({ key: this.apiKey })
      .timeout(10000)

    const data = results.body as OSDataHubPostcodeResponse

    return data.results.map(this.mapToAddress)
  }

  private mapToAddress(input: OSDataHubAddress): AddressWithoutType {
    const data = input.DPA
    return {
      addressLine1:
        (data.ORGANISATION_NAME || data.BUILDING_NUMBER || data.BUILDING_NAME || '') + ' ' + data.THOROUGHFARE_NAME,
      addressLine2: data.SUB_BUILDING_NAME || '',
      addressLine3: data.POST_TOWN || '',
      addressLine4: data.LOCAL_CUSTODIAN_CODE_DESCRIPTION || '',
      postcode: data.POSTCODE,
    }
  }
}
