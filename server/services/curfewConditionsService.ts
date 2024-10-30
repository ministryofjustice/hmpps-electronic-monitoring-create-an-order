import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import CurfewConditionsModel, { CurfewConditions } from '../models/CurfewConditions'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { serialiseDate } from '../utils/utils'
import { CurfewConditionsFormData } from '../models/form-data/curfewConditions'
import DateValidator from '../utils/validators/dateValidator'

type CurfewConditionsInput = AuthenticatedRequestInput & {
  orderId: string
  data: CurfewConditionsFormData
}

export default class CurfewConditionsService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: CurfewConditionsInput): Promise<CurfewConditions | ValidationResult> {
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
        path: `/api/orders/${input.orderId}/monitoring-conditions-curfew-conditions`,
        data: this.createApiModelFromFormData(input.data, input.orderId),
        token: input.accessToken,
      })
      return CurfewConditionsModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }

  private createApiModelFromFormData(formData: CurfewConditionsFormData, orderId: string): CurfewConditions {
    let addresses: string[] = []
    if (Array.isArray(formData.addresses)) {
      addresses = formData.addresses
    } else if (formData.addresses) {
      addresses = [formData.addresses]
    }

    return {
      orderId,
      startDate: serialiseDate(formData['startDate-year'], formData['startDate-month'], formData['startDate-day']),
      endDate: serialiseDate(formData['endDate-year'], formData['endDate-month'], formData['endDate-day']),
      curfewAddress: addresses?.join(',') ?? '',
    }
  }
}
