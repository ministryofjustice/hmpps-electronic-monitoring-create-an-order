import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import { TrailMonitoringFormData } from '../models/form-data/trailMonitoring'
import TrailMonitoringModel, { TrailMonitoring } from '../models/TrailMonitoring'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { ZodError } from 'zod'
import { convertZodErrorToValidationError } from '../utils/errors'
import {TrailMonitoringFormDataValidator} from '../models/form-data/trailMonitoring'

type TrailMonitoringInput = AuthenticatedRequestInput & {
  orderId: string
  data: TrailMonitoringFormData
}

export default class TrailMonitoringService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: TrailMonitoringInput): Promise<TrailMonitoring | ValidationResult> {    
    try {
      const requestBody = TrailMonitoringFormDataValidator.parse(input.data)     
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/monitoring-conditions-trail`,
        data: requestBody,
        token: input.accessToken,
      })
      return TrailMonitoringModel.parse(result)
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
