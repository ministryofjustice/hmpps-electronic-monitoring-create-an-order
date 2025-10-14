import { ZodError } from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import { validateUpdateProbationDevliveryUnitInput } from '../models/form-data/probationDeliveryUnit'
import ProbationDeliveryUnitModel, { ProbationDeliveryUnit } from '../models/ProbationDeliveryUnit'
import { ValidationResult } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { convertBackendErrorToValidationError, convertZodErrorToValidationError } from '../utils/errors'

type UpdateProbationDeliveryUnitInput = AuthenticatedRequestInput & {
  orderId: string
  data: {
    unit: string | null
  }
}

export default class ProbationDeliveryUnitService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: UpdateProbationDeliveryUnitInput): Promise<ProbationDeliveryUnit | ValidationResult> {
    try {
      const body = validateUpdateProbationDevliveryUnitInput(input.data)
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/probation-delivery-unit`,
        data: body,
        token: input.accessToken,
      })
      return ProbationDeliveryUnitModel.parse(result)
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
