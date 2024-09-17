import { getOrder } from '../data/inMemoryDatabase'

export default class InMemoryOrderSearchService {
  async getOrder(id: string) {
    const order = getOrder(id)
    return Promise.resolve(order)
  }
}
