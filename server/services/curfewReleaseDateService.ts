import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import { CurfewReleaseDate } from '../models/CurfewReleaseDate'
import { CurfewReleaseDateFormData } from '../models/form-data/curfewReleaseDate'
import { Order } from '../models/Order'
import { ValidationResult } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { convertBackendErrorToValidationError } from '../utils/errors'
import { serialiseTime } from '../utils/utils'

type CurfewReleaseDateInput = AuthenticatedRequestInput & {
  order: Order
  data: CurfewReleaseDateFormData
}

export default class CurfewReleaseDateService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: CurfewReleaseDateInput): Promise<undefined | ValidationResult> {
    try {
      await this.apiClient.put({
        path: `/api/orders/${input.order.id}/monitoring-conditions-curfew-release-date`,
        data: this.createApiModelFromFormData(input.data, input.order),
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

  private createApiModelFromFormData(formData: CurfewReleaseDateFormData, order: Order): CurfewReleaseDate {
    return {
      startTime: serialiseTime(formData.curfewTimesStartHours, formData.curfewTimesStartMinutes),
      endTime: serialiseTime(formData.curfewTimesEndHours, formData.curfewTimesEndMinutes),
      curfewAddress: formData.curfewAddress ?? null,
      releaseDate: order.curfewConditions?.startDate,
    }
  }
}
