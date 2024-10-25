import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import OrderModel, { Order } from '../models/Order'
import { ValidationResultModel } from '../models/Validation'
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
  async deleteOrder(id: string) {
    // Do nothing for now
    return Promise.resolve()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // Updating to call API endpoint(s):
  //  - Updating order status to SUBMITTED in CEMO DB
  //  - Submitting order to Serco
  //  - Returning reference number from Serco
  //  - Generating a PDF of form to download (and eventually emailing to user)

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
        return ValidationResultModel.parse((e as SanitisedError).data)
      }
      throw e
    }

    return Promise.resolve()
  }
}
