import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import DeviceWearerAddressModel, { DeviceWearerAddress } from '../models/DeviceWearerAddress'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type UpdateAddressRequest = AuthenticatedRequestInput & {
  orderId: string
  data: {
    addressType: string
    addressLine1: string
    addressLine2: string
    addressLine3: string
    addressLine4: string
    postcode: string
  }
}

export default class AddressService {
  constructor(private readonly apiClient: RestClient) {}

  async updateAddress(input: UpdateAddressRequest): Promise<DeviceWearerAddress | ValidationResult> {
    try {
      const result = await this.apiClient.post({
        path: `/api/order/${input.orderId}/address`,
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
