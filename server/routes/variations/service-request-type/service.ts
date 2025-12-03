import RestClient from '../../../data/restClient'
import { AuthenticatedRequestInput } from '../../../interfaces/request'
import OrderModel, { Order } from '../../../models/Order'

type CreateOrderInput = AuthenticatedRequestInput & {
  type: string
}

type OrderRequestInput = CreateOrderInput & {
  orderId: string
}

export default class ServiceRequestTypeService {
  constructor(private readonly apiClient: RestClient) {}

  async createVariationFromExisting(input: OrderRequestInput): Promise<void> {
    return this.apiClient.post({
      path: `/api/orders/${input.orderId}/amend-order`,
      data: { type: input.type },
      token: input.accessToken,
    })
  }

  async createVariation(input: CreateOrderInput): Promise<Order> {
    const result = this.apiClient.post({
      path: `/api/orders`,
      data: { type: input.type },
      token: input.accessToken,
    })
    return OrderModel.parse(result)
  }
}
