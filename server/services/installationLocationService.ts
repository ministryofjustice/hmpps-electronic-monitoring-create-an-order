import { ZodError } from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import InstallationLocationModel, { InstallationLocation } from '../models/InstallationLocation'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { InstallationLocationFromDataValidator } from '../models/form-data/installationLocation'
import { SanitisedError } from '../sanitisedError'
import { convertZodErrorToValidationError } from '../utils/errors'

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
      const requestBody = InstallationLocationFromDataValidator.parse(input.data)
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
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
