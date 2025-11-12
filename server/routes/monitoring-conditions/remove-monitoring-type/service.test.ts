import RestClient from '../../../data/restClient'
import RemoveMonitoringTypeService from './service'

jest.mock('../../../data/restClient')

describe('remove monitoring type service', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let service: RemoveMonitoringTypeService

  beforeEach(() => {
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    service = new RemoveMonitoringTypeService(mockRestClient)
  })

  it('calls the endpoint correctly', async () => {
    mockRestClient.delete.mockResolvedValue('successful')
    const result = await service.removeMonitoringType({
      orderId: 'mockOrderId',
      monitoringTypeId: 'mockTypeId',
      accessToken: 'token',
    })
    expect(result).toBe('successful')
    expect(mockRestClient.delete).toHaveBeenCalledWith({
      path: '/orders/mockOrderId/monitoring-conditions/monitoring-type/mockTypeId',
      token: 'token',
    })
  })

  it('throws error if not successful', async () => {
    mockRestClient.delete.mockRejectedValue(new Error('some error'))

    await expect(
      service.removeMonitoringType({
        orderId: 'some order id',
        monitoringTypeId: 'some id',
        accessToken: 'token',
      }),
    ).rejects.toThrow('some error')
  })
})
