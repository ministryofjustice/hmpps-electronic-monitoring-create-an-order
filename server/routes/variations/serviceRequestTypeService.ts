import RestClient from '../../data/restClient'
import { AuthenticatedRequestInput } from '../../interfaces/request'
import OrderModel, { Order } from '../../models/Order'

type CreateOrderInput = AuthenticatedRequestInput & {
  type: string
}

type OrderRequestInput = CreateOrderInput & {
  orderId: string | undefined
}

export default class ServiceRequestTypeService {
  constructor(private readonly apiClient: RestClient) {}

  async createNewVariation(input: OrderRequestInput, order: Order | undefined): Promise<string> {
    let id
    if (order !== undefined) {
      await this.createVariationFromExisting(input)
      id = order.id
    } else {
      const newOrder = await this.createVariation(input)
      id = newOrder.id
    }
    return id
  }

  async createVariationFromExisting(input: OrderRequestInput): Promise<void> {
    return this.apiClient.post({
      path: `/api/orders/${input.orderId}/amend-order`,
      data: { type: input.type },
      token: input.accessToken,
    })
  }

  async createVariation(input: CreateOrderInput): Promise<Order> {
    const result = await this.apiClient.post({
      path: `/api/orders`,
      data: { type: input.type },
      token: input.accessToken,
    })
    return OrderModel.parse(result)
  }
}
