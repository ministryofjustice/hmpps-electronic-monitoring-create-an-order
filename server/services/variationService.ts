import { ZodError } from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import { VariationDetailsFormData, validateVariationDetailsFormData } from '../models/form-data/variationDetails'
import VariationDetailsModel, { VariationDetails } from '../models/VariationDetails'
import { ValidationResult } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { convertZodErrorToValidationError, convertBackendErrorToValidationError } from '../utils/errors'

type UpdateVariationDetailsRequest = AuthenticatedRequestInput & {
  orderId: string
  data: VariationDetailsFormData
}

export default class VariationService {
  constructor(private readonly apiClient: RestClient) {}

  async updateVariationDetails(input: UpdateVariationDetailsRequest): Promise<VariationDetails | ValidationResult> {
    try {
      const requestBody = validateVariationDetailsFormData(input.data)
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/variation`,
        data: requestBody,
        token: input.accessToken,
      })

      return VariationDetailsModel.parse(result)
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
