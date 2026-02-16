import { ZodError } from 'zod'
import RestClient from '../../../data/restClient'
import { DapoFormValidator, DapoInput } from './formModel'
import { convertBackendErrorToValidationError, convertZodErrorToValidationError } from '../../../utils/errors'
import { SanitisedError } from '../../../sanitisedError'

type Input = {
  formData: DapoInput
  accessToken: string
  orderId: string
}

type RemoveDapoInput = {
  accessToken: string
  orderId: string
  clauseId: string
}

export default class DapoService {
  constructor(private readonly apiClient: RestClient) {}

  updateDapo = async (input: Input) => {
    try {
      const requestBody = DapoFormValidator.parse(input.formData)

      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/dapo`,
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

  deleteDapo = async (input: RemoveDapoInput) => {
    return this.apiClient.delete({
      path: `/api/orders/${input.orderId}/dapo/delete/${input.clauseId}`,
      token: input.accessToken,
    })
  }
}
