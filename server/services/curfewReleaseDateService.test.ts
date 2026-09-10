import RestClient from '../data/restClient'
import { createCurfewConditions, getMockOrder } from '../../test/mocks/mockOrder'
import { SanitisedError } from '../sanitisedError'
import CurfewReleaseDateService from './curfewReleaseDateService'

jest.mock('../data/restClient')

describe('CurfewReleaseDateService', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let service: CurfewReleaseDateService

  beforeEach(() => {
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    service = new CurfewReleaseDateService(mockRestClient)
  })

  describe('update', () => {
    it('persists the plain start/end times and address alongside the release date from the order', async () => {
      mockRestClient.put = jest.fn().mockResolvedValue(undefined)
      const order = getMockOrder({
        curfewConditions: createCurfewConditions({ startDate: '2025-01-01' }),
      })

      const result = await service.update({
        accessToken: 'token',
        order,
        data: { startTime: '19:00:00', endTime: '07:00:00', curfewAddress: 'PRIMARY' },
      })

      expect(result).toBeUndefined()
      expect(mockRestClient.put).toHaveBeenCalledWith({
        path: `/api/orders/${order.id}/monitoring-conditions-curfew-release-date`,
        data: {
          startTime: '19:00:00',
          endTime: '07:00:00',
          curfewAddress: 'PRIMARY',
          releaseDate: '2025-01-01',
        },
        token: 'token',
      })
    })

    it('defaults a missing curfew address to null', async () => {
      mockRestClient.put = jest.fn().mockResolvedValue(undefined)
      const order = getMockOrder({
        curfewConditions: createCurfewConditions({ startDate: '2025-01-01' }),
      })

      await service.update({
        accessToken: 'token',
        order,
        data: { startTime: '19:00:00', endTime: '07:00:00' },
      })

      expect(mockRestClient.put).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ curfewAddress: null }) }),
      )
    })

    it('returns a validation result when the api rejects the request', async () => {
      const order = getMockOrder({
        curfewConditions: createCurfewConditions({ startDate: '2025-01-01' }),
      })
      const sanitisedError = {
        status: 400,
        data: [{ field: 'startTime', error: 'Invalid time' }],
      } as unknown as SanitisedError
      mockRestClient.put = jest.fn().mockRejectedValue(sanitisedError)

      const result = await service.update({
        accessToken: 'token',
        order,
        data: { startTime: '19:00:00', endTime: '07:00:00' },
      })

      expect(result).toEqual([{ field: 'startTime', error: 'Invalid time', focusTarget: 'startTime-hours' }])
    })

    it('rethrows non-validation errors from the api', async () => {
      const order = getMockOrder({
        curfewConditions: createCurfewConditions({ startDate: '2025-01-01' }),
      })
      const sanitisedError = { status: 500 } as unknown as SanitisedError
      mockRestClient.put = jest.fn().mockRejectedValue(sanitisedError)

      await expect(
        service.update({
          accessToken: 'token',
          order,
          data: { startTime: '19:00:00', endTime: '07:00:00' },
        }),
      ).rejects.toEqual(sanitisedError)
    })

    it('throws when the order has no curfew start date', async () => {
      const order = getMockOrder({ curfewConditions: createCurfewConditions({ startDate: null }) })

      await expect(
        service.update({
          accessToken: 'token',
          order,
          data: { startTime: '19:00:00', endTime: '07:00:00' },
        }),
      ).rejects.toThrow(/Start date is undefined/)
    })
  })
})
