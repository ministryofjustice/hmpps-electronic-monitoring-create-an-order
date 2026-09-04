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
      firstName: 'Ermintrude',
      lastName: 'Jones',
      dateOfBirth: '1974-01-19T00:00:00Z',
      organisationSearchId: 'A1234BC',
    })

    const result = await service.getSearchResult({
      accessToken: 'fake-token',
      orderId: 'order-123',
      searchedIdentifier: 'A1234BC',
    })

    expect(mockRestClient.get).toHaveBeenCalledWith({
      path: '/api/orders/order-123/device-wearer-details',
      query: { organisationSearchId: 'A1234BC' },
      token: 'fake-token',
    })
    expect(result).toEqual({
      fullName: 'Ermintrude Jones',
      dateOfBirth: '1974-01-19T00:00:00Z',
    })
  })

  it('returns a default empty result when the remote server responds with 404', async () => {
    mockRestClient.get.mockRejectedValue({ status: 404 })

    const result = await service.getSearchResult({
      accessToken: 'fake-token',
      orderId: 'order-123',
      searchedIdentifier: 'A1234BC',
    })

    expect(result).toEqual({
      fullName: null,
      dateOfBirth: null,
    })
  })

  it('rethrows errors that are not a 404', async () => {
    mockRestClient.get.mockRejectedValue({ status: 500 })

    await expect(
      service.getSearchResult({
        accessToken: 'fake-token',
        orderId: 'order-123',
        searchedIdentifier: 'A1234BC',
      }),
    ).rejects.toEqual({ status: 500 })
  })

  it('confirms the selected search result', async () => {
    mockRestClient.put.mockResolvedValue({})

    await service.confirmSearchResult({
      accessToken: 'fake-token',
      orderId: 'order-123',
      searchedIdentifier: 'A1234BC',
    })

    expect(mockRestClient.put).toHaveBeenCalledWith({
      path: '/api/orders/order-123/device-wearer-details',
      token: 'fake-token',
      data: { organisationSearchId: 'A1234BC' },
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
