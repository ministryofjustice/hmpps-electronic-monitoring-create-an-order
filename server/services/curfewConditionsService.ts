import { ZodError } from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import CurfewConditionsModel, { CurfewConditions } from '../models/CurfewConditions'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { CurfewConditionsFormData, CurfewConditionsFormDataValidator } from '../models/form-data/curfewConditions'
import { convertZodErrorToValidationError } from '../utils/errors'

type CurfewConditionsInput = AuthenticatedRequestInput & {
  orderId: string
  data: CurfewConditionsFormData
}

export default class CurfewConditionsService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: CurfewConditionsInput): Promise<CurfewConditions | ValidationResult> {
    try {
      const requestBody = CurfewConditionsFormDataValidator.parse(input.data)
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/monitoring-conditions-curfew-conditions`,
        data: requestBody,
        token: input.accessToken,
      })
      return CurfewConditionsModel.parse(result)
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
