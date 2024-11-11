import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import InstallationAndRiskModel, { InstallationAndRisk } from '../models/InstallationAndRisk'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type UpdateMonitoringConditionsInput = AuthenticatedRequestInput & {
  orderId: string
  data: InstallationAndRisk
}

export default class InstallationAndRiskService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: UpdateMonitoringConditionsInput): Promise<InstallationAndRisk | ValidationResult> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/installation-and-risk`,
        data: input.data,
        token: input.accessToken,
      })
      return InstallationAndRiskModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
