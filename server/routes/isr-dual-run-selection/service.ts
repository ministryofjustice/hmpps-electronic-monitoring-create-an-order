import RestClient from '../../data/restClient'
import { AuthenticatedRequestInput } from '../../interfaces/request'

type OrderRequestInput = AuthenticatedRequestInput & {
  orderId: string
  isIsrFlag: boolean
}

export default class IsIsrService {
  constructor(private readonly apiClient: RestClient) {}

  async setIsrFlag(input: OrderRequestInput): Promise<void> {
    return this.apiClient.put({
      path: `/api/orders/${input.orderId}`, // isIsrFlag
      token: input.accessToken,
    })
  }
}
