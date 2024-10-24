import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import { CurfewReleaseDate } from '../models/CurfewReleaseDate'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type CurfewReleaseDateInput = AuthenticatedRequestInput & {
  orderId: string
  data: CurfewReleaseDate
}

export default class CurfewReleaseDateService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: CurfewReleaseDateInput): Promise<undefined | ValidationResult> {
    try {
      await this.apiClient.put({
        path: `/api/orders/${input.orderId}/monitoring-conditions-curfew-release-date`,
        data: input.data,
        token: input.accessToken,
      })
      return undefined
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
