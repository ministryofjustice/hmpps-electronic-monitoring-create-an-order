import { ZodError } from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import AddressModel, { Address } from '../models/Address'
import { AddressFormData, AddressFormDataValidator } from '../models/form-data/address'
import { ValidationResult } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { convertBackendErrorToValidationError, convertZodErrorToValidationError } from '../utils/errors'

export type UpdateAddressRequest = AuthenticatedRequestInput & {
  orderId: string
  data: AddressFormData & { addressType: string }
}

export default class AddressService {
  constructor(private readonly apiClient: RestClient) {}

  async updateAddress(input: UpdateAddressRequest): Promise<Address | ValidationResult> {
    try {
      const validatedFormData = AddressFormDataValidator.parse(input.data)

      const requestBody = {
        ...validatedFormData,
        addressType: validatedFormData.addressType?.toUpperCase(),
        hasAnotherAddress: validatedFormData.hasAnotherAddress === 'true',
      }

      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/address`,
        data: requestBody,
        token: input.accessToken,
      })

      return AddressModel.parse(result)
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
