import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import { CurfewReleaseDate } from '../models/CurfewReleaseDate'
import { Order } from '../models/Order'
import { ValidationResult } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { convertBackendErrorToValidationError } from '../utils/errors'

export type CurfewReleaseDateData = Pick<CurfewReleaseDate, 'startTime' | 'endTime'> & {
  curfewAddress?: string | null
}

type CurfewReleaseDateInput = AuthenticatedRequestInput & {
  order: Order
  data: CurfewReleaseDateData
}

export default class CurfewReleaseDateService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: CurfewReleaseDateInput): Promise<undefined | ValidationResult> {
    try {
      await this.apiClient.put({
        path: `/api/orders/${input.order.id}/monitoring-conditions-curfew-release-date`,
        data: this.createApiModel(input.data, input.order),
        token: input.accessToken,
      })
      return undefined
    } catch (e) {
      const sanitisedError = e as SanitisedError
      if (sanitisedError.status === 400) {
        return convertBackendErrorToValidationError(sanitisedError)
      }

      throw e
    }
  }

  private createApiModel(data: CurfewReleaseDateData, order: Order): CurfewReleaseDate {
    if (order.curfewConditions?.startDate === null || order.curfewConditions?.startDate === undefined) {
      throw new Error(
        `Start date is undefined for order: ${order.id}. Order must have a curfew start date before setting release date`,
      )
    }
    return {
      startTime: data.startTime,
      endTime: data.endTime,
      curfewAddress: data.curfewAddress ?? null,
      releaseDate: order.curfewConditions?.startDate,
    }
  }
}
