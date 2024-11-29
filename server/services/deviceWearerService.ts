import { ZodError } from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import DeviceWearerModel, { DeviceWearer } from '../models/DeviceWearer'
import { DeviceWearerFormDataValidator, DeviceWearerFormData } from '../models/form-data/deviceWearer'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { convertZodErrorToValidationError } from '../utils/errors'

type UpdateDeviceWearerRequestInput = AuthenticatedRequestInput & {
  orderId: string
  data: DeviceWearerFormData
}

type UpdateNoFixedAbodeRequest = AuthenticatedRequestInput & {
  orderId: string
  data: Pick<DeviceWearer, 'noFixedAbode'>
}

type UpdateIdentityNumbersRequest = AuthenticatedRequestInput & {
  orderId: string
  data: Pick<DeviceWearer, 'nomisId' | 'pncId' | 'deliusId' | 'prisonNumber' | 'homeOfficeReferenceNumber'>
}

export default class DeviceWearerService {
  constructor(private readonly apiClient: RestClient) {}

  async updateDeviceWearer(input: UpdateDeviceWearerRequestInput): Promise<DeviceWearer | ValidationResult> {
    try {
      const requestBody = DeviceWearerFormDataValidator.parse(input.data)
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/device-wearer`,
        data: requestBody,
        token: input.accessToken,
      })

      return DeviceWearerModel.parse(result)
    } catch (e) {
      if (e instanceof ZodError) {
        return convertZodErrorToValidationError(e)
      }

      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse(sanitisedError.data)
      }

      throw e
    }
  }

  async updateIdentityNumbers(input: UpdateIdentityNumbersRequest): Promise<DeviceWearer | ValidationResult> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/device-wearer/identity-numbers`,
        data: input.data,
        token: input.accessToken,
      })

      return DeviceWearerModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }

  async updateNoFixedAbode(input: UpdateNoFixedAbodeRequest): Promise<DeviceWearer | ValidationResult> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/device-wearer/no-fixed-abode`,
        data: input.data,
        token: input.accessToken,
      })

      return DeviceWearerModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
