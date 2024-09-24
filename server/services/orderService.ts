import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import OrderModel, { Order } from '../models/Order'

type GetOrderRequestInput = AuthenticatedRequestInput & {
  orderId: string
}

export default class OrderService {
  constructor(private readonly apiClient: RestClient) {}

  async createOrder(input: AuthenticatedRequestInput): Promise<Order> {
    const result = await this.apiClient.get({
      path: '/api/CreateForm',
      query: {
        title: 'MyNewForm',
      },
      token: input.accessToken,
    })

    return OrderModel.parse(result)
  }

  async getOrder(input: GetOrderRequestInput): Promise<Order> {
    const result = await this.apiClient.get({
      path: '/api/GetForm',
      query: {
        id: input.orderId,
      },
      token: input.accessToken,
    })

    return OrderModel.parse(result)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteOrder(id: string) {
    // Do nothing for now
    return Promise.resolve()
  }
}
