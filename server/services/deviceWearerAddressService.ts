import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import DeviceWearerAddressModel, { DeviceWearerAddress } from '../models/DeviceWearerAddress'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type UpdateDeviceWearerAddresssRequest = AuthenticatedRequestInput & {
  orderId: string
  data: {
    addressType: string
    addressLine1?: string
    addressLine2?: string
    addressLine3?: string
    addressLine4?: string
    postcode?: string
  }
}

export default class DeviceWearerAddressService {
  constructor(private readonly apiClient: RestClient) {}

  async updateAddress(input: UpdateDeviceWearerAddresssRequest): Promise<DeviceWearerAddress | ValidationResult> {
    try {
      const result = await this.apiClient.put({
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
