import { ZodError } from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import AttendanceMonitoringModel, { AttendanceMonitoring } from '../models/AttendanceMonitoring'
import { ValidationResult } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import {
  AttendanceMonitoringFormDataValidator,
  AttendanceMonitoringFormData,
} from '../models/form-data/attendanceMonitoring'
import { convertZodErrorToValidationError, convertBackendErrorToValidationError } from '../utils/errors'

type AttendanceMonitoringInput = AuthenticatedRequestInput & {
  orderId: string
  data: AttendanceMonitoringFormData
}

export default class AttendanceMonitoringService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: AttendanceMonitoringInput): Promise<AttendanceMonitoring | ValidationResult> {
    try {
      const requestBody = AttendanceMonitoringFormDataValidator.parse(input.data)
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
