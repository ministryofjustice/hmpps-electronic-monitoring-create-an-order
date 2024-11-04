import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import InterestedPartiesModel, { InterestedParties } from '../models/InterestedParties'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type UpdateInterestedPartiesRequest = AuthenticatedRequestInput & {
  orderId: string
  data: InterestedParties
}

export default class InterestedPartiesService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: UpdateInterestedPartiesRequest): Promise<InterestedParties | ValidationResult> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/interested-parties`,
        data: input.data,
        token: input.accessToken,
      })
      return InterestedPartiesModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
