import RestClient from '../../data/restClient'
import { AuthenticatedRequestInput } from '../../interfaces/request'
import { MonitoringConditions as MonitoringConditionsModdel } from './model'
import logger from '../../../logger'
import MonitoringConditionsModel, { MonitoringConditions } from '../../models/MonitoringConditions'

export type UpdateMonitoringConditionsInput = AuthenticatedRequestInput & {
  orderId: string
  data: MonitoringConditionsModdel
}
export default class MonitoringConditionsUpdateService {
  constructor(private readonly apiClient: RestClient) {}

  async updateMonitoringConditions(input: UpdateMonitoringConditionsInput): Promise<MonitoringConditions> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/monitoring-conditions`,
        data: input.data,
        token: input.accessToken,
      })

      return MonitoringConditionsModel.parse(result)
    } catch (e) {
      logger.error('Failed to submit monitoring conditions')
      throw e
    }
  }
}
