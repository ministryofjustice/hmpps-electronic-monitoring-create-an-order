import RestClient from '../data/restClient'
import OrderListModel, { OrderList } from '../models/OrderList'

export interface OrderSearchInput {
  searchTerm: string
}

export default class OrderSearchService {
  constructor(private readonly apiClient: RestClient) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async searchOrders(accessToken: string, input: OrderSearchInput): Promise<OrderList> {
    const result = await this.apiClient.get({
      path: '/api/ListForms',
      token: accessToken,
    })

    const orders = OrderListModel.parse(result)

    return orders
  }
}
