import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import InstallationLocationModel, { InstallationLocation } from '../models/InstallationLocation'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type UpdateInstallationLocationInput = AuthenticatedRequestInput & {
  orderId: string
  data: {
    location: string
  }
}

export default class InstallationLocationService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: UpdateInstallationLocationInput): Promise<InstallationLocation | ValidationResult> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/installation-location`,
        data: input.data,
        token: input.accessToken,
      })
      return InstallationLocationModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
