import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import OrderModel, { Order } from '../models/Order'

type GetOrderRequestInput = AuthenticatedRequestInput & {
  orderId: string
}

export default class OrderService {
  constructor(private readonly apiClient: RestClient) {}

  async createOrder(input: AuthenticatedRequestInput): Promise<Order> {
    const result = await this.apiClient.post({
      path: '/api/orders',
      token: input.accessToken,
    })
    return OrderModel.parse(result)
  }

  async getOrder(input: GetOrderRequestInput): Promise<Order> {
    const result = await this.apiClient.get({
      path: `/api/orders/${input.orderId}`,
      token: input.accessToken,
    })
    return OrderModel.parse(result)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteOrder(id: string) {
    // Do nothing for now
    return Promise.resolve()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async submitOrder(id: string) {
    // Do nothing for now
    // Will call API endpoint(s):
    //  - Updating order status to SUBMITTED in CEMO DB
    //  - Submitting order to Serco
    //  - Returning reference number from Serco
    //  - Generating a PDF of form to download (and eventually emailing to user)
    return Promise.resolve()
  }
}
