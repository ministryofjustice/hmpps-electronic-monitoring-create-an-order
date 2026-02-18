import RestClient from '../../../data/restClient'
import { AuthenticatedRequestInput } from '../../../interfaces/request'
import { Order } from '../../../models/Order'
import FeatureFlags from '../../../utils/featureFlags'
import { findMonitoringTypeById } from '../utils/monitoringTypes'

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

  shouldRemoveTagAtSource = (order: Order, monitoringTypeId: string) => {
    if (order.interestedParties?.notifyingOrganisation !== 'PRISON') {
      return false
    }

    const prisonsInPilot = FeatureFlags.getInstance().getValue('TAG_AT_SOURCE_PILOT_PRISONS').split(',')

    if (prisonsInPilot?.indexOf(order.interestedParties.notifyingOrganisationName ?? '') === -1) {
      const match = findMonitoringTypeById(order, monitoringTypeId)
      return match !== undefined && match.type === 'Alcohol monitoring'
    }

    return false
  }
}
