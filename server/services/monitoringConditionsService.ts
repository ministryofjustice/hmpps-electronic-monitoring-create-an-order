import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import MonitoringConditionsModel, { MonitoringConditions } from '../models/MonitoringConditions'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type UpdateMonitoringConditionsInput = AuthenticatedRequestInput & {
  orderId: string
  data: Omit<MonitoringConditions, 'isValid'>
}
export default class MonitoringConditionsService {
  constructor(private readonly apiClient: RestClient) {}

  async updateMonitoringConditions(
    input: UpdateMonitoringConditionsInput,
  ): Promise<MonitoringConditions | ValidationResult> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/monitoring-conditions`,
        data: input.data,
        token: input.accessToken,
      })
      return MonitoringConditionsModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
