import { ZodError } from 'zod'
import RestClient from '../../../data/restClient'
import { AuthenticatedRequestInput } from '../../../interfaces/request'
import DetailsOfInstallationModel, { DetailsOfInstallation } from '../../../models/DetailsOfInstallation'
import { ValidationResult } from '../../../models/Validation'
import { SanitisedError } from '../../../sanitisedError'
import { convertBackendErrorToValidationError, convertZodErrorToValidationError } from '../../../utils/errors'
import { DetailsOfInstallationInput, DetailsOfInstallationValidator } from './formModel'

type UpdateDetailsOfInstallationInput = AuthenticatedRequestInput & {
  orderId: string
  data: Omit<DetailsOfInstallationInput, 'action'>
}

export default class DetailsOfInstallationService {
  constructor(private readonly apiClient: RestClient) {}

  async updateDetailsOfInstallation(
    input: UpdateDetailsOfInstallationInput,
  ): Promise<DetailsOfInstallation | ValidationResult> {
    try {
      const parsedData = DetailsOfInstallationValidator.parse(input.data)
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/details-of-installation`,
        data: parsedData,
        token: input.accessToken,
      })
      return DetailsOfInstallationModel.parse(result)
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
