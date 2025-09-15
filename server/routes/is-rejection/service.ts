import RestClient from '../../data/restClient'
import { AuthenticatedRequestInput } from '../../interfaces/request'

type OrderRequestInput = AuthenticatedRequestInput & {
  orderId: string
}

export default class IsRejectionService {
  constructor(private readonly apiClient: RestClient) {}

  async createVariationFromExisting(input: OrderRequestInput): Promise<void> {
    return this.apiClient.post({
      path: `/api/orders/${input.orderId}/copy-as-variation`,
      token: input.accessToken,
    })
  }

  async createAmendOriginalFromExisting(input: OrderRequestInput): Promise<void> {
    return this.apiClient.post({
      path: `/api/orders/${input.orderId}/amend-rejected-order`,
      token: input.accessToken,
    })
  }
}
