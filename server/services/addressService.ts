import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import DeviceWearerAddressModel, { DeviceWearerAddressInformation } from '../models/DeviceWearerAddressInformation'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type UpdateAddressRequest = AuthenticatedRequestInput & {
  orderId: string
  data: Partial<DeviceWearerAddressInformation>
}

export default class AddressService {
  constructor(private readonly apiClient: RestClient) {}

  async updateAddress(input: UpdateAddressRequest): Promise<DeviceWearerAddressInformation | ValidationResult> {
    try {
      const result = await this.apiClient.patch({
        path: `/api/orders/${input.orderId}/address`,
        data: input.data,
        token: input.accessToken,
      })

      return DeviceWearerAddressModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
