import z from 'zod'
import RestClient from '../../../data/restClient'
import { AuthenticatedRequestInput } from '../../../interfaces/request'

const DeviceWearerSearchResultResponseModel = z.object({
  fullName: z.string().nullable().optional(),
  dateOfBirth: z.string().datetime().nullable().optional(),
})

export type DeviceWearerSearchResultResponse = z.infer<typeof DeviceWearerSearchResultResponseModel>

type GetSearchResultInput = AuthenticatedRequestInput & {
  orderId: string
  searchedIdentifier: string
}

type ConfirmSearchResultInput = AuthenticatedRequestInput & {
  orderId: string
  searchedIdentifier: string
}

export default class DeviceWearerSearchResultsService {
  constructor(private readonly apiClient: RestClient) {}

  async getSearchResult(input: GetSearchResultInput): Promise<DeviceWearerSearchResultResponse> {
    const response = await this.apiClient.get({
      path: `/api/orders/${input.orderId}/device-wearer/search-results`,
      query: { searchedIdentifier: input.searchedIdentifier },
      token: input.accessToken,
    })

    return DeviceWearerSearchResultResponseModel.parse(response)
  }

  async confirmSearchResult(input: ConfirmSearchResultInput): Promise<void> {
    await this.apiClient.post({
      path: `/api/orders/${input.orderId}/device-wearer/search-results/confirm`,
      token: input.accessToken,
      data: {
        searchedIdentifier: input.searchedIdentifier,
      },
    })
  }

  hasSearchMatch(searchResult: DeviceWearerSearchResultResponse): boolean {
    return Boolean(searchResult.fullName || searchResult.dateOfBirth)
  }

  getDisplayDateOfBirth(searchResult: DeviceWearerSearchResultResponse): string {
    if (!searchResult.dateOfBirth) {
      return ''
    }

    return new Date(searchResult.dateOfBirth).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }
}
