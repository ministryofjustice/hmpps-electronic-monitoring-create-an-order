import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'

export type FmsRequestInput = AuthenticatedRequestInput & {
  orderId: string
  versionId: string
}

export default class FmsRequestService {
  constructor(private readonly apiClient: RestClient) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getFmsDeviceWearerRequest(input: FmsRequestInput): Promise<string> {
    const result = await this.apiClient.get<string>({
      path: `/api/orders/${input.orderId}/versions/${input.versionId}/fmsDeviceWearerRequest`,
      token: input.accessToken,
    })

    return result
  }

  async getFmsMonitoringRequest(input: FmsRequestInput): Promise<string> {
    const result = await this.apiClient.get<string>({
      path: `/api/orders/${input.orderId}/versions/${input.versionId}/fmsMonitoringOrderRequest`,
      token: input.accessToken,
    })

    return result
  }
}
