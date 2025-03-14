import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import Result from '../interfaces/result'
import ErrorResponseModel from '../models/ErrorResponse'
import { CreateOrderFormData } from '../models/form-data/order'
import OrderModel, { Order } from '../models/Order'
import { SanitisedError } from '../sanitisedError'

type CreateOrderRequest = AuthenticatedRequestInput & {
  data: CreateOrderFormData
}

type OrderRequestInput = AuthenticatedRequestInput & {
  orderId: string
}

type OrderSubmissionSuccess = {
  submitted: true
  data: unknown
}

type OrderSubmissionFailure = {
  submitted: false
  type: 'incomplete' | 'errorStatus' | 'alreadySubmitted' | 'partialSuccess'
  error: string
}

type OrderSubmissionResult = OrderSubmissionSuccess | OrderSubmissionFailure

export default class OrderService {
  constructor(private readonly apiClient: RestClient) {}

  async createOrder(input: CreateOrderRequest): Promise<Order> {
    const result = await this.apiClient.post({
      path: '/api/orders',
      token: input.accessToken,
      data: input.data,
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

  async deleteOrder(input: OrderRequestInput): Promise<Result<void, string>> {
    try {
      await this.apiClient.delete({
        path: `/api/orders/${input.orderId}`,
        token: input.accessToken,
      })

      return {
        ok: true,
      }
    } catch (e) {
      const error = e as SanitisedError

      if (error.status === 500) {
        return {
          ok: false,
          error: error.message,
        }
      }

      throw e
    }
  }

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

        if (
          apiError.developerMessage === 'This order has encountered an error and cannot be submitted' ||
          apiError.developerMessage === 'The order could not be submitted to Serco'
        ) {
          return {
            submitted: false,
            type: 'errorStatus',
            error: apiError.userMessage || '',
          }
        }

        if (apiError.developerMessage === 'Error submit attachments to Serco') {
          return {
            submitted: false,
            type: 'partialSuccess',
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
