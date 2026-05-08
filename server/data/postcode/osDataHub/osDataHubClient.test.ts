import RestClient from '../../restClient'
import AddressMapper from './addressMapper'
import OSDataHubClient from './osDataHubClient'

describe('osDataHubClient', () => {
  const apiClient = {
    getWithoutBearer: jest.fn(),
  } as unknown as jest.Mocked<RestClient>
  const addressMapper = {
    mapToAddresses: jest.fn(),
  } as unknown as jest.Mocked<AddressMapper>

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns no address when postcode lookup returns bad request', async () => {
    apiClient.getWithoutBearer.mockRejectedValue({ status: 400 })
    const client = new OSDataHubClient(apiClient, addressMapper, 'mockApiKey')

    const result = await client.lookupByPostcode('SW1A2AA')

    expect(result).toEqual([])
    expect(addressMapper.mapToAddresses).not.toHaveBeenCalled()
  })

  it('requests 31 for postcode lookup results to detect results over 30', async () => {
    apiClient.getWithoutBearer.mockResolvedValue({ results: [] })
    addressMapper.mapToAddresses.mockReturnValue([])
    const client = new OSDataHubClient(apiClient, addressMapper, 'mockApiKey')

    await client.lookupByPostcode('SW1A2AA')

    expect(apiClient.getWithoutBearer).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/search/places/v1/postcode',
        query: 'postcode=SW1A2AA&dataset=DPA&maxresults=31',
      }),
    )
  })
})
