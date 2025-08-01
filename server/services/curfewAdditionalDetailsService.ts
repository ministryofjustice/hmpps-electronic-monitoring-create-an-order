import { ZodError } from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import CurfewConditionsModel, { CurfewConditions } from '../models/CurfewConditions'
import { ValidationResult } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { convertZodErrorToValidationError, convertBackendErrorToValidationError } from '../utils/errors'
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
      const validatedBody = CurfewAdditionalDetailsFormDataValidator.parse(input.data)
      const requestBody = { curfewAdditionalDetails: validatedBody.curfewAdditionalDetails }
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
        return convertBackendErrorToValidationError(sanitisedError)
      }

      throw e
    }
  }
}
