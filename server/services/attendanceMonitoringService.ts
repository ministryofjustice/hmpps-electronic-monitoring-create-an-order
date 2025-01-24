import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import AttendanceMonitoringModel, { AttendanceMonitoring } from '../models/AttendanceMonitoring'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type AttendanceMonitoringInput = AuthenticatedRequestInput & {
  orderId: string
  addressLine1: string | null
  addressLine2: string | null
  addressLine3: string | null
  addressLine4: string | null
  postcode: string | null
  appointmentDay: string | null
  endDate: string | null
  endTime: string | null
  purpose: string | null
  startDate: string | null
  startTime: string | null
  id?: string | undefined
}

export default class AttendanceMonitoringService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: AttendanceMonitoringInput): Promise<AttendanceMonitoring | ValidationResult> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/mandatory-attendance`,
        data: input,
        token: input.accessToken,
      })
      return AttendanceMonitoringModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
