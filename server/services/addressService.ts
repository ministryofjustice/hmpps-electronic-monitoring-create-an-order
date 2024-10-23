import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import AddressModel, { Address } from '../models/Address'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type UpdateAddressRequest = AuthenticatedRequestInput & {
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

export default class AddressService {
  constructor(private readonly apiClient: RestClient) {}

  async updateAddress(input: UpdateAddressRequest): Promise<Address | ValidationResult> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/address`,
        data: input.data,
        token: input.accessToken,
      })

      return AddressModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
