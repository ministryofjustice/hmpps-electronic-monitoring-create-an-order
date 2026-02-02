import { ZodError } from 'zod'
import RestClient from '../../../data/restClient'
import { OffenceOtherInfoFormDataValidator, OffenceOtherInfoInput } from './formModel'
import { SanitisedError } from '../../../sanitisedError'
import { convertZodErrorToValidationError, convertBackendErrorToValidationError } from '../../../utils/errors'

type Input = {
  orderId: string
  accessToken: string
  formData: OffenceOtherInfoInput
}

export default class OffenceOtherInfoService {
  constructor(private readonly apiClient: RestClient) {}

  updateOffenceOtherInfo = async (input: Input) => {
    try {
      const validatedData = OffenceOtherInfoFormDataValidator.parse(input.formData)

      const requestBody = {
        additionalDetailsRequired: validatedData.hasOtherInformation === 'yes',
        additionalDetails: validatedData.otherInformationDetails,
      }

      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/offence-additional-details`,
        data: requestBody,
        token: input.accessToken,
      })

      return result
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
