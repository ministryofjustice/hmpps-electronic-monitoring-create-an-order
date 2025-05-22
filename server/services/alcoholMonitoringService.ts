import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import AlcoholMonitoringModel, {
  AlcoholMonitoring
} from '../models/AlcoholMonitoring'
import { ZodError } from 'zod'
import { AlcoholMonitoringFormData, AlcoholMonitoringFormDataValidator } from '../models/form-data/alcoholMonitoring'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { convertZodErrorToValidationError } from '../utils/errors'

type AlcoholMonitoringInput = AuthenticatedRequestInput & {
  orderId: string
  data: AlcoholMonitoringFormData
}

export default class AlcoholMonitoringService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: AlcoholMonitoringInput): Promise<AlcoholMonitoring | ValidationResult> {
    

    try {
      const requestBody = AlcoholMonitoringFormDataValidator.parse(input.data)
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/monitoring-conditions-alcohol`,
        data: requestBody,
        token: input.accessToken,
      })
      return AlcoholMonitoringModel.parse(result)
    } catch (e) {
      if (e instanceof ZodError) {
        return convertZodErrorToValidationError(e)
      }
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }

  
}
