import { ZodError } from 'zod'
import RestClient from '../../../data/restClient'
import { OffenceFormValidator, OffenceInput } from './formModel'
import { convertBackendErrorToValidationError, convertZodErrorToValidationError } from '../../../utils/errors'
import { SanitisedError } from '../../../sanitisedError'

type Input = {
  formData: OffenceInput
  accessToken: string
  dateRequired: boolean
  orderId: string
  multiOffence: boolean
}

type RemoveOffenceInput = {
  accessToken: string
  orderId: string
  offenceId: string
}

export default class OffenceService {
  constructor(private readonly apiClient: RestClient) {}

  updateOffence = async (input: Input) => {
    try {
      const validatedInput = OffenceFormValidator(input.dateRequired, input.multiOffence).parse(input.formData)

      const requestBody = input.multiOffence
        ? {
            ...validatedInput,
            offences: validatedInput.offences,
            offenceType: validatedInput.offences?.[0] ?? '',
          }
        : {
            ...validatedInput,
            offences: validatedInput.offenceType ? [validatedInput.offenceType] : [],
          }

      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/offence`,
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

  deleteOffence = async (input: RemoveOffenceInput) => {
    return this.apiClient.delete({
      path: `/api/orders/${input.orderId}/offence/delete/${input.offenceId}`,
      token: input.accessToken,
    })
  }
}
