import { NextFunction, Request, Response } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
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
})
