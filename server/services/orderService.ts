import RestClient from '../data/restClient'
import { getOrder } from '../data/inMemoryDatabase'

export default class OrderService {
  constructor(private readonly apiClient: RestClient) {}

  async createOrder(accessToken: string) {
    const result = await this.apiClient.get({
      path: '/api/CreateForm',
      query: {
        title: 'MyNewForm',
      },
      token: accessToken,
    })

    return result
  }

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
