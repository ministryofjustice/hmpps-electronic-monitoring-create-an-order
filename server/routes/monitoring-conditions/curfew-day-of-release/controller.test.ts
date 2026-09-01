import { NextFunction, Request, Response } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import { getMockOrder } from '../../../../test/mocks/mockOrder'
import { validationErrors } from '../../../constants/validationErrors'
import CurfewDayOfReleaseController from './controller'

describe('curfew day of release controller', () => {
  let controller: CurfewDayOfReleaseController
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    controller = new CurfewDayOfReleaseController()
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

    it('continues to the curfew on release day page when an answer is given', async () => {
      const order = getMockOrder()
      req = createMockRequest({ order, body: { action: 'continue', standardCurfewTimes: 'NO' } })
      req.flash = jest.fn()

      await controller.update(req, res, next)

      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/monitoring-conditions/curfew/release-date`)
    })
  })
})
