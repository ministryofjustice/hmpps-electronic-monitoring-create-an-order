import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import CurfewConditionsModel, { CurfewConditions } from '../models/CurfewConditions'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type AlcoholMonitoringInput = AuthenticatedRequestInput & {
  orderId: string
  data: CurfewConditions
}

export default class CurfewConditionsService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: AlcoholMonitoringInput): Promise<CurfewConditions | ValidationResult> {
    return Promise.resolve({
      addresses: [],
      endDate: '',
      startDate: '',
    })
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/monitoring-conditions-curfew-conditions`,
        data: input.data,
        token: input.accessToken,
      })
      return CurfewConditionsModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
