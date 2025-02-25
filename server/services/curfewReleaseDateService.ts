import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import { CurfewReleaseDate } from '../models/CurfewReleaseDate'
import { CurfewReleaseDateFormData } from '../models/form-data/curfewReleaseDate'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { serialiseDate, serialiseTime } from '../utils/utils'
import DateValidator from '../utils/validators/dateValidator'

type CurfewReleaseDateInput = AuthenticatedRequestInput & {
  orderId: string
  data: CurfewReleaseDateFormData
}

export default class CurfewReleaseDateService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: CurfewReleaseDateInput): Promise<undefined | ValidationResult> {
    const isReleaseDateValid = DateValidator.isValidDateFormat(
      input.data.releaseDateDay,
      input.data.releaseDateMonth,
      input.data.releaseDateYear,
      'releaseDate',
    )
    if (isReleaseDateValid.result === false) {
      return ValidationResultModel.parse([isReleaseDateValid.error])
    }

    try {
      await this.apiClient.put({
        path: `/api/orders/${input.orderId}/monitoring-conditions-curfew-release-date`,
        data: this.createApiModelFromFormData(input.data),
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

  private createApiModelFromFormData(formData: CurfewReleaseDateFormData): CurfewReleaseDate {
    return {
      releaseDate: serialiseDate(formData.releaseDateYear, formData.releaseDateMonth, formData.releaseDateDay),
      startTime: serialiseTime(formData.curfewTimesStartHours, formData.curfewTimesStartMinutes),
      endTime: serialiseTime(formData.curfewTimesEndHours, formData.curfewTimesEndMinutes),
      curfewAddress: formData.address ?? null,
    }
  }
}
