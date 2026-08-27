import z from 'zod'
import RestClient from '../../../data/restClient'
import { AuthenticatedRequestInput } from '../../../interfaces/request'

const DeviceWearerSearchResultResponseModel = z.object({
  fullName: z.string().nullable().optional(),
  dateOfBirth: z.string().datetime({ offset: true }).nullable().optional(),
})

const GetCorePersonDetailsResponseModel = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  dateOfBirth: z.string().datetime({ offset: true }).nullable().optional(),
  organisationSearchId: z.string(),
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
      path: `/api/orders/${input.orderId}/device-wearer-details`,
      query: { organisationSearchId: input.searchedIdentifier },
      token: input.accessToken,
    })

    const personDetails = GetCorePersonDetailsResponseModel.parse(response)
    const fullName = [personDetails.firstName?.trim(), personDetails.lastName?.trim()]
      .filter((name): name is string => Boolean(name))
      .join(' ')

    return DeviceWearerSearchResultResponseModel.parse({
      fullName: fullName || null,
      dateOfBirth: personDetails.dateOfBirth ?? null,
    })
  }

  async confirmSearchResult(input: ConfirmSearchResultInput): Promise<void> {
    await this.apiClient.put({
      path: `/api/orders/${input.orderId}/device-wearer-details`,
      token: input.accessToken,
      data: {
        organisationSearchId: input.searchedIdentifier,
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
