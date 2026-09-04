import { NextFunction, Request, Response } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import { createInterestedParties, getMockOrder } from '../../../../test/mocks/mockOrder'
import { validationErrors } from '../../../constants/validationErrors'
import CurfewTimetableQuestionController from './controller'

describe('curfew timetable question controller', () => {
  let controller: CurfewTimetableQuestionController
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    controller = new CurfewTimetableQuestionController()
    req = createMockRequest({
      order: getMockOrder({
        interestedParties: createInterestedParties({ notifyingOrganisation: 'PRISON' }),
      }),
    })
    req.flash = jest.fn().mockReturnValue([])
    res = createMockResponse()
    next = jest.fn()
  })

  it('renders the curfew timetable question template', async () => {
    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(
      'pages/order/monitoring-conditions/curfew-timetable-question',
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
          error: validationErrors.curfewTimetableQuestion.standardCurfewTimesRequired,
          field: 'standardCurfewTimes',
          focusTarget: 'standardCurfewTimes',
        },
      ])
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/monitoring-conditions/curfew/timetable-question`)
    })
  })
})
