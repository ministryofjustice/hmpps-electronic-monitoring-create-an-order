import RestClient from '../../data/restClient'
import StatusUpdateService from './service'

jest.mock('../../data/restClient')

const statusUpdate = {
  id: 'c4b8f4b9-7c64-4ef0-bc8e-bd0a7a6a8b6a',
  orderId: 'c4b8f4b9-7c64-4ef0-bc8e-bd0a7a6a8b6e',
  orderVersionId: 'c4b8f4b9-7c64-4ef0-bc8e-bd0a7a6a8b6b',
  orderVersionType: 'REQUEST',
  status: 'REJECTED',
  datetimeOfStatusChange: '2026-01-01T12:00:00Z',
  statusUpdatedBy: null,
  reasons: [{ section: 'Monitoring conditions', details: null }],
}

describe('StatusUpdateService', () => {
  let get: jest.Mock
  let service: StatusUpdateService

  beforeEach(() => {
    get = jest.fn()
    service = new StatusUpdateService({ get } as unknown as RestClient)
  })

  it('fetches and parses status updates', async () => {
    get.mockResolvedValue([statusUpdate])

    const result = await service.getStatusUpdates({ orderId: statusUpdate.orderId, accessToken: 'token' })

    expect(get).toHaveBeenCalledWith({ path: `/api/orders/${statusUpdate.orderId}/status-updates`, token: 'token' })
    expect(result).toEqual([statusUpdate])
  })

  it('returns an empty list when the request fails', async () => {
    get.mockRejectedValue(new Error('boom'))

    expect(await service.getStatusUpdates({ orderId: statusUpdate.orderId, accessToken: 'token' })).toEqual([])
  })

  it('returns an empty list when the response is invalid', async () => {
    get.mockResolvedValue([{ id: 'nope' }])

    expect(await service.getStatusUpdates({ orderId: statusUpdate.orderId, accessToken: 'token' })).toEqual([])
  })
})
