import RestClient from '../../../data/restClient'
import { Address } from '../../../models/Address'
import { Order } from '../../../models/Order'

type CorePersonDetails = {
  firstName: string | null
  lastName: string | null
  dateOfBirth: string | null
  organisationSearchId: string
  addresses: Address[]
}

type CorePersonRecordRequest = {
  accessToken: string
  orderId: string
  organisationSearchId: string
}

export default class CorePersonRecordService {
  constructor(private readonly apiClient: RestClient) {}

  getPersonDetails(input: CorePersonRecordRequest): Promise<CorePersonDetails> {
    return this.apiClient.get({
      path: `/api/orders/${input.orderId}/device-wearer-details`,
      query: { organisationSearchId: input.organisationSearchId },
      token: input.accessToken,
    }) as Promise<CorePersonDetails>
  }

  getOrganisationSearchId(order: Order): string | null {
    if (order.interestedParties?.notifyingOrganisation === 'PRISON') {
      return order.deviceWearer.prisonNumber
    }

    if (order.interestedParties?.notifyingOrganisation === 'PROBATION') {
      return order.deviceWearer.deliusId
    }

    return null
  }
}

export type { CorePersonDetails }
