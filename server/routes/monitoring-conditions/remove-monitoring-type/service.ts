import RestClient from '../../../data/restClient'
import { AuthenticatedRequestInput } from '../../../interfaces/request'

type removeMonitornigTypeInput = AuthenticatedRequestInput & {
  orderId: string
  monitoringTypeId: string
}

export default class RemoveMonitoringTypeService {
  constructor(private readonly apiClient: RestClient) {}

  removeMonitoringType = async (input: removeMonitornigTypeInput) => {
    return this.apiClient.delete({
      path: `/orders/${input.orderId}/monitoring-conditions/monitoring-type/${input.monitoringTypeId}`,
      token: input.accessToken,
    })
  }
}
