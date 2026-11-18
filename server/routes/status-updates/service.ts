import logger from '../../../logger'
import RestClient from '../../data/restClient'
import { AuthenticatedRequestInput } from '../../interfaces/request'
import { StatusUpdate, StatusUpdateListModel } from '../../models/StatusUpdate'

type GetStatusUpdatesInput = AuthenticatedRequestInput & {
  orderId: string
}

export default class StatusUpdateService {
  constructor(private readonly apiClient: RestClient) {}

  async getStatusUpdates(input: GetStatusUpdatesInput): Promise<StatusUpdate[]> {
    try {
      const result = await this.apiClient.get({
        path: `/api/orders/${input.orderId}/status-updates`,
        token: input.accessToken,
      })
      return StatusUpdateListModel.parse(result)
    } catch (error) {
      logger.error(
        { err: error, event: 'status_updates_load_failed', orderId: input.orderId },
        'Failed to load order status updates',
      )
      return []
    }
  }
}
