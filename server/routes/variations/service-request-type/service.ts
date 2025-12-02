import RestClient from '../../../data/restClient'
import { AuthenticatedRequestInput } from '../../../interfaces/request'

type OrderRequestInput = AuthenticatedRequestInput & {
  orderId: string
  serviceRequestType: string
}

export default class ServiceRequestTypeService {
  constructor(private readonly apiClient: RestClient) {}

  async createVariationFromExisting(input: OrderRequestInput): Promise<void> {
    return this.apiClient.post({
      path: `/api/orders/${input.orderId}/amend-order`,
      data: { serviceRequestType: input.serviceRequestType },
      token: input.accessToken,
    })
  }
}
