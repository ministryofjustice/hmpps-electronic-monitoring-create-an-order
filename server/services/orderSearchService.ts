import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import { OrderListInformation, OrderListInformationList } from '../models/OrderListInformation'
import { OrderListView } from '../models/form-data/OrderListView'
import { OrderSearchResult, OrderSearchResultsModel } from '../models/OrderSearchResult'

export type OrderSearchInput = AuthenticatedRequestInput & {
  searchTerm: string
}

export default class OrderSearchService {
  constructor(private readonly apiClient: RestClient) {}

  async listOrders(input: AuthenticatedRequestInput, view: OrderListView): Promise<OrderListInformation[]> {
    const result = await this.apiClient.get({
      path: '/api/orders',
      query: { view },
      token: input.accessToken,
    })

    return OrderListInformationList.parse(result)
  }

  async searchOrders(input: OrderSearchInput): Promise<OrderSearchResult[]> {
    const result = await this.apiClient.get({
      path: '/api/orders/search',
      token: input.accessToken,
      query: { searchTerm: input.searchTerm },
    })

    return OrderSearchResultsModel.parse(result)
  }
}
