import RestClient from '../../../data/restClient'
import { AuthenticatedRequestInput } from '../../../interfaces/request'

type removeMonitornigTypeInput = AuthenticatedRequestInput & {
  orderId: string
  monitoringTypeId: string
}

type removeTagAtSourceInput = AuthenticatedRequestInput & {
  orderId: string
}

export default class RemoveMonitoringTypeService {
  constructor(private readonly apiClient: RestClient) {}

  removeMonitoringType = async (input: removeMonitornigTypeInput) => {
    return this.apiClient.delete({
      path: `/api/orders/${input.orderId}/monitoring-conditions/monitoring-type/${input.monitoringTypeId}`,
      token: input.accessToken,
    })
  }

  removeTagAtSource = async (input: removeTagAtSourceInput) => {
    return this.apiClient.delete({
      path: `/api/orders/${input.orderId}/monitoring-conditions/tag-at-source`,
      token: input.accessToken,
    })
  }
}
