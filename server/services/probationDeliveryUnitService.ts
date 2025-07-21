import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import ProbationDeliveryUnitModel, { ProbationDeliveryUnit } from '../models/ProbationDeliveryUnit'
import { ValidationResult } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { convertBackendErrorToValidationError } from '../utils/errors'

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
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/probation-delivery-unit`,
        data: input.data,
        token: input.accessToken,
      })
      return ProbationDeliveryUnitModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError
      if (sanitisedError.status === 400) {
        return convertBackendErrorToValidationError(sanitisedError)
      }

      throw e
    }
  }
}
