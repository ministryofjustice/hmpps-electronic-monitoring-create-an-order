import RestClient from '../../data/restClient'
import { AuthenticatedRequestInput } from '../../interfaces/request'
import { MonitoringConditions } from './model'
import logger from '../../../logger'

export type UpdateMonitoringConditionsInput = AuthenticatedRequestInput & {
  orderId: string
  data: MonitoringConditions
}
export default class MonitoringConditionsUpdateService {
  constructor(private readonly apiClient: RestClient) {}

  async updateMonitoringConditions(input: UpdateMonitoringConditionsInput): Promise<void> {
    try {
      await this.apiClient.put({
        path: `/api/orders/${input.orderId}/monitoring-conditions`,
        data: input.data,
        token: input.accessToken,
      })
    } catch (e) {
      logger.error('Failed to submit monitoring conditions')
      throw e
    }
  }
}
