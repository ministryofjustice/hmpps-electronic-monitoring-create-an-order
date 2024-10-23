import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import AttendanceMonitoringModel, { AttendanceMonitoring } from '../models/AttendanceMonitoring'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type AttendanceMonitoringInput = AuthenticatedRequestInput & {
  orderId: string
  data: AttendanceMonitoring
}

export default class AttendanceMonitoringService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: AttendanceMonitoringInput): Promise<AttendanceMonitoring | ValidationResult> {
    return Promise.resolve({
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      addressLine4: '',
      postcode: '',
      appointmentDay: '',
      endDate: '',
      endTime: '',
      purpose: '',
      startDate: '',
      startTime: '',
      id: '',
    })
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/monitoring-conditions-attendance`,
        data: input.data,
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
