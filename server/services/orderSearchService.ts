import { getOrders } from '../data/inMemoryDatabase'

export interface OrderSearchInput {
  searchTerm: string
}

export default class InMemoryOrderSearchService {
  async searchOrders(input: OrderSearchInput) {
    return Promise.resolve(getOrders())
  }
}
