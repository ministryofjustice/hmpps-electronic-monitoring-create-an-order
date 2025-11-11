import { ZodError } from 'zod'
import RestClient from '../../../data/restClient'
import { AuthenticatedRequestInput } from '../../../interfaces/request'
import AttendanceMonitoringModel, { AttendanceMonitoring } from '../../../models/AttendanceMonitoring'
import { ValidationResult } from '../../../models/Validation'
import { SanitisedError } from '../../../sanitisedError'
import { AttendanceMonitoringAddToListFormData, AttendanceMonitoringAddToListFormDataValidator } from './formModel'
import { convertBackendErrorToValidationError, convertZodErrorToValidationError } from '../../../utils/errors'

type AttendanceMonitoringInput = AuthenticatedRequestInput & {
  orderId: string
  data: AttendanceMonitoringAddToListFormData
}

export default class AttendanceMonitoringAddToListService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: AttendanceMonitoringInput): Promise<AttendanceMonitoring | ValidationResult> {
    try {
      const requestBody = AttendanceMonitoringAddToListFormDataValidator.parse(input.data)
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/mandatory-attendance`,
        data: requestBody,
        token: input.accessToken,
      })
      return AttendanceMonitoringModel.parse(result)
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
