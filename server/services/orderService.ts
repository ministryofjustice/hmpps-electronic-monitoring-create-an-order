import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import OrderModel, { Order } from '../models/Order'
import { SanitisedError } from '../sanitisedError'

type OrderRequestInput = AuthenticatedRequestInput & {
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

  async getOrder(input: OrderRequestInput): Promise<Order> {
    const result = await this.apiClient.get({
      path: `/api/orders/${input.orderId}`,
      token: input.accessToken,
    })
    return OrderModel.parse(result)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteOrder(input: OrderRequestInput) {
    // Do nothing for now
    return Promise.resolve()
  }

  async submitOrder(input: OrderRequestInput) {
    try {
      const result = await this.apiClient.post({
        path: `/api/orders/${input.orderId}/submit`,
        token: input.accessToken,
      })

      return result
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return e as SanitisedError
      }

      throw e
    }
  }
}
