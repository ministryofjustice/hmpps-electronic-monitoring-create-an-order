import z from 'zod'
import superagent from 'superagent'
import Address, { addressSchema } from './Address'
import logger from '../../../logger'

const addressSearchSchema = z.object({
  results: z.array(z.object({ DPA: addressSchema })),
})

export default class AddressSearch {
  async search(postcode: string): Promise<Address[]> {
    if (!postcode) {
      return []
    }

    let response
    try {
      response = await superagent
        .get(`https://api.os.uk/search/places/v1/postcode?postcode=${postcode}`)
        .set({
          key: process.env.osapikey,
        })
        .then(res => res.body)
    } catch (e) {
      logger.warn(e)
      return []
    }

    const parsedResponse = addressSearchSchema.parse(response)

    return parsedResponse.results.map(result => Address.fromJson(result.DPA))
  }
}
