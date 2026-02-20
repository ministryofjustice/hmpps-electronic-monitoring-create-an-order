import RestClient from '../../data/restClient'
import InterestedPartiesModel, { InterestedParties } from './model'
import logger from '../../../logger'
import { AuthenticatedRequestInput } from '../../interfaces/request'

export type UpdateInterestedPartiesInput = AuthenticatedRequestInput & {
  orderId: string
  data: InterestedParties
}

export default class UpdateInterestedPartiesService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: UpdateInterestedPartiesInput): Promise<InterestedParties> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/interested-parties`,
        data: input.data,
        token: input.accessToken,
      })
      return InterestedPartiesModel.parse(result)
    } catch (e) {
      logger.error('Failed to submit interested parties')
      throw e
    }
  }
}
