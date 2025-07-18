import { ZodError } from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import InstallationLocationModel, { InstallationLocation } from '../models/InstallationLocation'
import { ValidationResult } from '../models/Validation'
import { InstallationLocationFormDataValidator } from '../models/form-data/installationLocation'
import { SanitisedError } from '../sanitisedError'
import { convertZodErrorToValidationError, convertBackendErrorToValidationError } from '../utils/errors'

type UpdateInstallationLocationInput = AuthenticatedRequestInput & {
  orderId: string
  data: {
    location: string
  }
}

export default class InstallationLocationService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: UpdateInstallationLocationInput): Promise<InstallationLocation | ValidationResult> {
    try {
      const requestBody = InstallationLocationFormDataValidator.parse(input.data)
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/installation-location`,
        data: requestBody,
        token: input.accessToken,
      })
      return InstallationLocationModel.parse(result)
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
