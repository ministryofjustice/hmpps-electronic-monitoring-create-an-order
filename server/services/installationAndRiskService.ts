import { ZodError } from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import InstallationAndRiskModel, { InstallationAndRisk } from '../models/InstallationAndRisk'
import { ValidationResult } from '../models/Validation'
import {
  InstallationAndRiskFormData,
  InstallationAndRiskFormDataValidator,
} from '../models/form-data/installationAndRisk'
import { SanitisedError } from '../sanitisedError'
import { convertZodErrorToValidationError, convertBackendErrorToValidationError } from '../utils/errors'

type UpdateMonitoringConditionsInput = AuthenticatedRequestInput & {
  orderId: string
  data: InstallationAndRiskFormData
}

export default class InstallationAndRiskService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: UpdateMonitoringConditionsInput): Promise<InstallationAndRisk | ValidationResult> {
    try {
      const requestBody = InstallationAndRiskFormDataValidator.parse(input.data)
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/installation-and-risk`,
        data: requestBody,
        token: input.accessToken,
      })
      return InstallationAndRiskModel.parse(result)
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
