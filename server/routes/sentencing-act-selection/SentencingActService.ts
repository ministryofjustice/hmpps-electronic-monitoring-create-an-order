import RestClient from '../../data/restClient'
import { AuthenticatedRequestInput } from '../../interfaces/request'
import { ValidationResult } from '../../models/Validation'
import { SanitisedError } from '../../sanitisedError'
import logger from '../../../logger'
import { convertBackendErrorToValidationError } from '../../utils/errors'

type SetSentencingActFlag = AuthenticatedRequestInput & {
  orderId: string
  isSentencingAct: boolean
}

export default class SentencingActService {
  constructor(private readonly apiClient: RestClient) {}

  async setSentencingActFlag(input: SetSentencingActFlag): Promise<void | ValidationResult> {
    try {
      return await this.apiClient.put({
        path: `/api/orders/${input.orderId}/sentencing-act`,
        data: { isSentencingAct: input.isSentencingAct },
        token: input.accessToken,
      })
    } catch (e) {
      logger.error('Failed to update orders isSentencingAct')
      const sanitised = e as SanitisedError
      if (sanitised.status === 400) return convertBackendErrorToValidationError(sanitised)
      throw e
    }
  }
}
