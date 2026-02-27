import { ZodError } from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import DeviceWearerContactDetailsModel, { ContactDetails } from '../models/ContactDetails'
import { ValidationResult } from '../models/Validation'
import { ContactDetailsFormData, ContactDetailsFormDataValidator } from '../models/form-data/contactDetails'
import { SanitisedError } from '../sanitisedError'
import { convertBackendErrorToValidationError, convertZodErrorToValidationError } from '../utils/errors'

type UpdateContactDetailsRequest = AuthenticatedRequestInput & {
  orderId: string
  data: ContactDetailsFormData
}

export default class ContactDetailsService {
  constructor(private readonly apiClient: RestClient) {}

  async updateContactDetails(input: UpdateContactDetailsRequest): Promise<ContactDetails | ValidationResult> {
    try {
      const requestBody = ContactDetailsFormDataValidator.parse(input.data)
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/contact-details`,
        data: requestBody,
        token: input.accessToken,
      })

      return DeviceWearerContactDetailsModel.parse(result)
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
