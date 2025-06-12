import { ZodError } from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import CurfewConditionsModel, { CurfewConditions } from '../models/CurfewConditions'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { convertZodErrorToValidationError } from '../utils/errors'
import {
  CurfewAdditionalDetailsFormData,
  CurfewAdditionalDetailsFormDataValidator,
} from '../models/form-data/curfewAdditionalDetails'

type CurfewAdditionalDetailsInput = AuthenticatedRequestInput & {
  orderId: string
  data: CurfewAdditionalDetailsFormData
}

export default class CurfewAdditionalDetailsService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: CurfewAdditionalDetailsInput): Promise<CurfewConditions | ValidationResult> {
    try {
      const requestBody = CurfewAdditionalDetailsFormDataValidator.parse(input.data)
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/monitoring-conditions-curfew-additional-details`,
        data: requestBody,
        token: input.accessToken,
      })
      // doesn't show
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
