import { ZodError } from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import DeviceWearerResponsibleAdultModel, { DeviceWearerResponsibleAdult } from '../models/DeviceWearerResponsibleAdult'
import { DeviceWearerResponsibleAdultFormDataValidator } from '../models/form-data/responsibleAdult'
import { ValidationResult } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { convertBackendErrorToValidationError, convertZodErrorToValidationError } from '../utils/errors'

type UpdateDeviceWearerResponsibleAdultRequestInput = AuthenticatedRequestInput & {
  orderId: string
  data: {
    relationship: string
    fullName: string
    contactNumber: string | null
  }
}

export default class DeviceWearerResponsibleAdultService {
  constructor(private readonly apiClient: RestClient) {}

  async updateDeviceWearerResponsibleAdult(
    input: UpdateDeviceWearerResponsibleAdultRequestInput,
  ): Promise<DeviceWearerResponsibleAdult | ValidationResult> {
    try {
      const requestBody = DeviceWearerResponsibleAdultFormDataValidator.parse(input.data)

      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/device-wearer-responsible-adult`,
        data: requestBody,
        token: input.accessToken,
      })

      return DeviceWearerResponsibleAdultModel.parse(result)
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
