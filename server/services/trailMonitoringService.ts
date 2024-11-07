import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import { TrailMonitoringFormData } from '../models/form-data/trailMonitoring'
import TrailMonitoringModel, { TrailMonitoring } from '../models/TrailMonitoring'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { serialiseDate } from '../utils/utils'
import DateValidator from '../utils/validators/dateValidator'

type TrailMonitoringInput = AuthenticatedRequestInput & {
  orderId: string
  data: TrailMonitoringFormData
}

export default class TrailMonitoringService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: TrailMonitoringInput): Promise<TrailMonitoring | ValidationResult> {
    const dateValidationErrors: ValidationResult = []

    const isStartDateValid = DateValidator.isValidDateFormat(
      input.data['startDate-day'],
      input.data['startDate-month'],
      input.data['startDate-year'],
      'startDate',
    )
    const isEndDateValid = DateValidator.isValidDateFormat(
      input.data['endDate-day'],
      input.data['endDate-month'],
      input.data['endDate-year'],
      'endDate',
    )
    if (isStartDateValid.result === false) {
      dateValidationErrors.push(isStartDateValid.error!)
    }
    if (isEndDateValid.result === false) {
      dateValidationErrors.push(isEndDateValid.error!)
    }

    if (dateValidationErrors.length > 0) {
      return ValidationResultModel.parse(dateValidationErrors)
    }

    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/monitoring-conditions-trail`,
        data: this.createApiModelFromFormData(input.data),
        token: input.accessToken,
      })
      return TrailMonitoringModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }

  private createApiModelFromFormData(formData: TrailMonitoringFormData): TrailMonitoring {
    return {
      startDate: serialiseDate(formData['startDate-year'], formData['startDate-month'], formData['startDate-day']),
      endDate: serialiseDate(formData['endDate-year'], formData['endDate-month'], formData['endDate-day']),
    }
  }
}
