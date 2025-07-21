import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import DeviceWearerContactDetailsModel, { ContactDetails } from '../models/ContactDetails'
import { ValidationResult } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { convertBackendErrorToValidationError } from '../utils/errors'

type UpdateContactDetailsRequest = AuthenticatedRequestInput & {
  orderId: string
  data: {
    contactNumber: string | null
  }
}

export default class ContactDetailsService {
  constructor(private readonly apiClient: RestClient) {}

  async updateContactDetails(input: UpdateContactDetailsRequest): Promise<ContactDetails | ValidationResult> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/contact-details`,
        data: input.data,
        token: input.accessToken,
      })

      return DeviceWearerContactDetailsModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError
      if (sanitisedError.status === 400) {
        return convertBackendErrorToValidationError(sanitisedError)
      }

      throw e
    }
  }
}
