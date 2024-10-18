import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import NotifyingOrganisationModel, { NotifyingOrganisation } from '../models/NotifyingOrganisation'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type UpdateNotifyingOrganisationRequest = AuthenticatedRequestInput & {
  orderId: string
  data: NotifyingOrganisation
}

export default class NotifyingOrganisationService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: UpdateNotifyingOrganisationRequest): Promise<NotifyingOrganisation | ValidationResult> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/notifying-organisation`,
        data: input.data,
        token: input.accessToken,
      })
      return NotifyingOrganisationModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
