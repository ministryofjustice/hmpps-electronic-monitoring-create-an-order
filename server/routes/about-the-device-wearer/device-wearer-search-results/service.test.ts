import RestClient from '../../../data/restClient'
import DeviceWearerSearchResultsService from './service'

jest.mock('../../../data/restClient')

describe('DeviceWearerSearchResultsService', () => {
  const mockRestClient = new RestClient('cemoApi', {
    url: '',
    timeout: { response: 0, deadline: 0 },
    agent: { timeout: 0 },
  }) as jest.Mocked<RestClient>

  const service = new DeviceWearerSearchResultsService(mockRestClient)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('gets search result by searched identifier', async () => {
    mockRestClient.get.mockResolvedValue({
      fullName: 'Ermintrude Jones',
      dateOfBirth: '1974-01-19T00:00:00Z',
    })

    const result = await service.getSearchResult({
      accessToken: 'fake-token',
      orderId: 'order-123',
      searchedIdentifier: 'A1234BC',
    })

    expect(mockRestClient.get).toHaveBeenCalledWith({
      path: '/api/orders/order-123/device-wearer/search-results',
      token: 'fake-token',
    })
    expect(result).toEqual({
      fullName: 'Ermintrude Jones',
      dateOfBirth: '1974-01-19T00:00:00Z',
    })
  })

  it('confirms the selected search result', async () => {
    mockRestClient.post.mockResolvedValue({})

    await service.confirmSearchResult({
      accessToken: 'fake-token',
      orderId: 'order-123',
      searchedIdentifier: 'A1234BC',
    })

    expect(mockRestClient.post).toHaveBeenCalledWith({
      path: '/api/orders/order-123/device-wearer/search-results/confirm',
      token: 'fake-token',
      data: { searchedIdentifier: 'A1234BC' },
    })
  })

  it('returns true when search result has a matching person', () => {
    expect(service.hasSearchMatch({ fullName: 'Ermintrude Jones', dateOfBirth: null })).toBe(true)
  })

  it('returns false when search result has no matching person', () => {
    expect(service.hasSearchMatch({ fullName: null, dateOfBirth: null })).toBe(false)
  })

  it('formats date of birth for display', () => {
    expect(service.getDisplayDateOfBirth({ fullName: null, dateOfBirth: '1974-01-19T00:00:00Z' })).toBe(
      '19 January 1974',
    )
  })
})
