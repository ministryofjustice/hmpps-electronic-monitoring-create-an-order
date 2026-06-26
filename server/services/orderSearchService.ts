import RestClient from '../data/restClient'
import OrderListModel, { OrderList } from '../models/OrderList'
import { AuthenticatedRequestInput } from '../interfaces/request'
import { OrderListInformation, OrderListInformationList } from '../models/OrderListInformation'

export type OrderSearchInput = AuthenticatedRequestInput & {
  searchTerm: string
}

export default class OrderSearchService {
  constructor(private readonly apiClient: RestClient) {}

  async listOrders(input: AuthenticatedRequestInput): Promise<OrderListInformation[]> {
    const result = await this.apiClient.get({
      path: '/api/orders',
      token: input.accessToken,
    })

    return OrderListInformationList.parse(result)
  }

  async searchOrders(input: OrderSearchInput): Promise<OrderList> {
    const result = await this.apiClient.get({
      path: '/api/orders/search',
      token: input.accessToken,
      query: { searchTerm: input.searchTerm },
    })

    return OrderListModel.parse(result)
  }
}
