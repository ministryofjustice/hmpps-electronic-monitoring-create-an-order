import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import ErrorResponseModel from '../models/ErrorResponse'
import OrderModel, { Order } from '../models/Order'
import { SanitisedError } from '../sanitisedError'

type OrderRequestInput = AuthenticatedRequestInput & {
  orderId: string
}

type OrderSubmissionSuccess = {
  submitted: true
  data: unknown
}

type OrderSubmissionFailure = {
  submitted: false
  type: 'incomplete' | 'errorStatus' | 'alreadySubmitted'
  error: string
}

type OrderSubmissionResult = OrderSubmissionSuccess | OrderSubmissionFailure

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

  async submitOrder(input: OrderRequestInput): Promise<OrderSubmissionResult> {
    try {
      const result = await this.apiClient.post({
        path: `/api/orders/${input.orderId}/submit`,
        token: input.accessToken,
      })
      return {
        submitted: true,
        data: result,
      }
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        const apiError = ErrorResponseModel.parse(sanitisedError.data)

        if (apiError.developerMessage === 'Please complete all mandatory fields before submitting this form') {
          return {
            submitted: false,
            type: 'incomplete',
            error: apiError.userMessage || '',
          }
        }

        if (apiError.developerMessage === 'This order has encountered an error and cannot be submitted' ||
          'The order could not be submitted to Serco') {
          return {
            submitted: false,
            type: 'errorStatus',
            error: apiError.userMessage || '',
          }
        }

        if (apiError.developerMessage === 'This order has already been submitted') {
          return {
            submitted: false,
            type: 'alreadySubmitted',
            error: apiError.userMessage || '',
          }
        }
      }

      throw e
    }
  }
}
