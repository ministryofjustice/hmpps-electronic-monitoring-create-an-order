import { NextFunction, Request, Response } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import { getMockOrder } from '../../../../test/mocks/mockOrder'
import { validationErrors } from '../../../constants/validationErrors'
import RestClient from '../../../data/restClient'
import CurfewReleaseDateService from '../../../services/curfewReleaseDateService'
import CurfewDayOfReleaseController from './controller'

jest.mock('../../../data/restClient')
jest.mock('../../../services/curfewReleaseDateService')

describe('curfew day of release controller', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let curfewReleaseDateService: jest.Mocked<CurfewReleaseDateService>
  let controller: CurfewDayOfReleaseController
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    curfewReleaseDateService = new CurfewReleaseDateService(mockRestClient) as jest.Mocked<CurfewReleaseDateService>
    curfewReleaseDateService.update.mockResolvedValue(undefined)
    controller = new CurfewDayOfReleaseController(curfewReleaseDateService)
    req = createMockRequest()
    req.flash = jest.fn().mockReturnValue([])
    res = createMockResponse()
    next = jest.fn()
  })

  it('renders the curfew day of release template', async () => {
    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(
      'pages/order/monitoring-conditions/curfew-day-of-release',
      expect.anything(),
    )
  })

  it('prefills the saved answer when the standard curfew times are already saved', async () => {
    req = createMockRequest({
      order: getMockOrder({
        curfewReleaseDateConditions: {
          startTime: '19:00:00',
          endTime: '07:00:00',
          curfewAddress: null,
          releaseDate: null,
        },
      }),
    })
    req.flash = jest.fn().mockReturnValue([])

    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(
      'pages/order/monitoring-conditions/curfew-day-of-release',
      expect.objectContaining({ standardCurfewTimes: { value: 'YES' } }),
    )
  })

  describe('update', () => {
    it('rejects a submission with no answer and returns to the question page', async () => {
      const order = getMockOrder()
      req = createMockRequest({ order, body: { action: 'continue' } })
      req.flash = jest.fn()

      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        {
          error: validationErrors.curfewDayOfRelease.standardCurfewTimesRequired,
          field: 'standardCurfewTimes',
          focusTarget: 'standardCurfewTimes',
        },
      ])
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/monitoring-conditions/curfew/day-of-release`)
    })

    it('continues to the curfew on release day page when the answer is no', async () => {
      const order = getMockOrder()
      req = createMockRequest({ order, body: { action: 'continue', standardCurfewTimes: 'NO' } })
      req.flash = jest.fn()

      await controller.update(req, res, next)

      expect(req.flash).not.toHaveBeenCalled()
      expect(curfewReleaseDateService.update).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/monitoring-conditions/curfew/release-date`)
    })

    it('returns to the order summary without saving when the answer is no and saving as draft', async () => {
      const order = getMockOrder()
      req = createMockRequest({ order, body: { action: 'back', standardCurfewTimes: 'NO' } })
      req.flash = jest.fn()
      res.locals.orderSummaryUri = `/order/${order.id}/summary`

      await controller.update(req, res, next)

      expect(curfewReleaseDateService.update).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(res.locals.orderSummaryUri)
    })

    it('saves the standard curfew times and skips the release day page when the answer is yes', async () => {
      const order = getMockOrder()
      req = createMockRequest({ order, body: { action: 'continue', standardCurfewTimes: 'YES' } })
      req.flash = jest.fn()

      await controller.update(req, res, next)

      expect(curfewReleaseDateService.update).toHaveBeenCalledWith({
        accessToken: res.locals.user.token,
        order,
        data: {
          action: 'continue',
          curfewAddress: undefined,
          curfewTimesStartHours: '19',
          curfewTimesStartMinutes: '00',
          curfewTimesEndHours: '07',
          curfewTimesEndMinutes: '00',
        },
      })
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/monitoring-conditions/curfew/additional-details`)
    })

    it('preserves an already selected release day curfew address when the answer is yes', async () => {
      const order = getMockOrder({
        curfewReleaseDateConditions: {
          startTime: '20:00:00',
          endTime: '08:00:00',
          curfewAddress: 'PRIMARY',
          releaseDate: '2025-01-01',
        },
      })
      req = createMockRequest({ order, body: { action: 'continue', standardCurfewTimes: 'YES' } })
      req.flash = jest.fn()

      await controller.update(req, res, next)

      expect(curfewReleaseDateService.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ curfewAddress: 'PRIMARY' }),
        }),
      )
    })

    it('returns to the question page with the errors when the api rejects the standard curfew times', async () => {
      const order = getMockOrder()
      const validationResult = [{ error: 'Start date is required', field: 'releaseDate' }]
      curfewReleaseDateService.update.mockResolvedValue(validationResult)
      req = createMockRequest({ order, body: { action: 'continue', standardCurfewTimes: 'YES' } })
      req.flash = jest.fn()

      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', validationResult)
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/monitoring-conditions/curfew/day-of-release`)
    })

    it('saves the standard curfew times and returns to the order summary when saving as draft', async () => {
      const order = getMockOrder()
      req = createMockRequest({ order, body: { action: 'back', standardCurfewTimes: 'YES' } })
      req.flash = jest.fn()
      res.locals.orderSummaryUri = `/order/${order.id}/summary`

      await controller.update(req, res, next)

      expect(curfewReleaseDateService.update).toHaveBeenCalledWith({
        accessToken: res.locals.user.token,
        order,
        data: {
          action: 'continue',
          curfewAddress: undefined,
          curfewTimesStartHours: '19',
          curfewTimesStartMinutes: '00',
          curfewTimesEndHours: '07',
          curfewTimesEndMinutes: '00',
        },
      })
      expect(res.redirect).toHaveBeenCalledWith(res.locals.orderSummaryUri)
    })
  })
})
