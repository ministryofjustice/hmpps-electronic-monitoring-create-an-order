import { getOrder } from '../data/inMemoryDatabase'

export default class OrderService {
  async getOrder(id: string) {
    const order = getOrder(id)
    return Promise.resolve(order)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteOrder(id: string) {
    // Do nothing for now
    return Promise.resolve()
  }
}
