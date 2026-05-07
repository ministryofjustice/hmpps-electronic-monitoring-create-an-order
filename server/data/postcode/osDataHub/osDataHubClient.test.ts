import RestClient from '../../restClient'
import AddressMapper from './addressMapper'
import OSDataHubClient from './osDataHubClient'

// test for other bad request from api and one for maxResults
describe('osDataHubClient', () => {
  const apiClient = {
    getWithoutBearer: jest.fn(),
  } as unknown as jest.Mocked<RestClient>
  const addressMapper = {
    mapToAddressess: jest.fn(),
  } as unknown as jest.Mocked<AddressMapper>

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns no address when postcode lookup returns 400 request', async () => {
    apiClient.getWithoutBearer.mockRejectedValue({ status: 400 })
    const client = new OSDataHubClient(apiClient, addressMapper, 'mockApiKey')

    const result = await client.lookupByPostcode('SW1A2AA')

    expect(result).toEqual([])
    expect(addressMapper.mapToAddresses).not.toHaveBeenCalled()
  })
})
