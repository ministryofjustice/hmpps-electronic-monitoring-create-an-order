import { ZodError } from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import MonitoringConditionsModel, { MonitoringConditions } from '../models/MonitoringConditions'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { convertZodErrorToValidationError } from '../utils/errors'
import {
  MonitoringConditionsFormData,
  validateMonitoringConditionsFormData,
} from '../models/form-data/monitoringConditions'

export type UpdateMonitoringConditionsInput = AuthenticatedRequestInput & {
  orderId: string
  data: MonitoringConditionsFormData
}
export default class MonitoringConditionsService {
  constructor(private readonly apiClient: RestClient) {}

  async updateMonitoringConditions(
    input: UpdateMonitoringConditionsInput,
  ): Promise<MonitoringConditions | ValidationResult> {
    try {
      const requestBody = validateMonitoringConditionsFormData(input.data)
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/monitoring-conditions`,
        data: requestBody,
        token: input.accessToken,
      })
      return MonitoringConditionsModel.parse(result)
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
