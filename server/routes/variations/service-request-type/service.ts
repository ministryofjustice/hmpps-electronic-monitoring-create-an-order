import RestClient from '../../../data/restClient'
import { AuthenticatedRequestInput } from '../../../interfaces/request'
import OrderModel, { Order } from '../../../models/Order'

type CreateOrderInput = AuthenticatedRequestInput & {
  serviceRequestType: string
}

type OrderRequestInput = CreateOrderInput & {
  orderId: string
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

  async createVariation(input: CreateOrderInput): Promise<Order> {
    const result = this.apiClient.post({
      path: `/api/orders`,
      data: {
        type: 'VARIATION',
        serviceRequestType: input.serviceRequestType,
      },
      token: input.accessToken,
    })
    return OrderModel.parse(result)
  }
}
