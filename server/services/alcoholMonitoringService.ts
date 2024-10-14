import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import AlcoholMonitoringModel, { AlcoholMonitoring } from '../models/AlcoholMonitoring'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type AlcoholMonitoringInput = AuthenticatedRequestInput & {
  orderId: string
  data: AlcoholMonitoring
}

export default class AlcoholMonitoringService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: AlcoholMonitoringInput): Promise<AlcoholMonitoring | ValidationResult> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/monitoring-conditions-alcohol`,
        data: input.data,
        token: input.accessToken,
      })
      return AlcoholMonitoringModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
