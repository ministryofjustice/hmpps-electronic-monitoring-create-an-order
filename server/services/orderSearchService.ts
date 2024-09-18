import { getOrders } from '../data/inMemoryDatabase'

export interface OrderSearchInput {
  searchTerm: string
}

export default class InMemoryOrderSearchService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async searchOrders(input: OrderSearchInput) {
    return Promise.resolve(getOrders())
  }
}
