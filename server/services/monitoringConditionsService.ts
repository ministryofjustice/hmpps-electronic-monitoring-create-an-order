import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import { DeviceWearer } from '../models/DeviceWearer'
import { MonitoringConditions } from '../models/MonitoringConditions'
import { ValidationResult } from '../models/Validation'

type UpdateMonitoringConditionsInput = AuthenticatedRequestInput & {
  orderId: string
  data: MonitoringConditions
}
export default class MonitoringConditionsService {
  constructor(private readonly apiClient: RestClient) {}

  async updateMonitoringConditions(input: UpdateMonitoringConditionsInput): Promise<DeviceWearer | ValidationResult> {
    // TODO: Implement once the API is in place
    return { monitoringConditions: input } as unknown as DeviceWearer
  }
}
