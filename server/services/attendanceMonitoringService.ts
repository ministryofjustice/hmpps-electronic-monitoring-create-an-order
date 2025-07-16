import { ZodError } from 'zod'
import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import AttendanceMonitoringModel, { AttendanceMonitoring } from '../models/AttendanceMonitoring'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import {
  AttendanceMonitoringFormDataValidator,
  AttendanceMonitoringFormData,
} from '../models/form-data/attendanceMonitoring'
import { convertZodErrorToValidationError } from '../utils/errors'
import processBackendValidationErrors from '../utils/validators/processBackendValidationErrors'

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
        const parsedErrors = ValidationResultModel.parse((e as SanitisedError).data)
        return processBackendValidationErrors(parsedErrors)
      }

      throw e
    }
  }
}
