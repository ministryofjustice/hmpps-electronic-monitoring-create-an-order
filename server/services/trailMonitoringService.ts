import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import TrailMonitoringModel, { TrailMonitoring } from '../models/TrailMonitoring'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type TrailMonitoringInput = AuthenticatedRequestInput & {
  orderId: string
  data: TrailMonitoring
}

export default class TrailMonitoringService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: TrailMonitoringInput): Promise<TrailMonitoring | ValidationResult> {
    try {
      const result = await this.apiClient.post({
        path: `/api/order/${input.orderId}/trail-monitoring`,
        data: input.data,
        token: input.accessToken,
      })
      return TrailMonitoringModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
