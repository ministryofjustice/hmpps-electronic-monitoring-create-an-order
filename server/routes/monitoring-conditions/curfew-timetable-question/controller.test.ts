import { NextFunction, Request, Response } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import { createInterestedParties, getMockOrder } from '../../../../test/mocks/mockOrder'
import { validationErrors } from '../../../constants/validationErrors'
import RestClient from '../../../data/restClient'
import CurfewTimetableService from '../../../services/curfewTimetableService'
import CurfewTimetableQuestionController from './controller'

jest.mock('../../../data/restClient')
jest.mock('../../../services/curfewTimetableService')

describe('curfew timetable question controller', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let curfewTimetableService: jest.Mocked<CurfewTimetableService>
  let controller: CurfewTimetableQuestionController
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    curfewTimetableService = new CurfewTimetableService(mockRestClient) as jest.Mocked<CurfewTimetableService>
    curfewTimetableService.update.mockResolvedValue([])
    controller = new CurfewTimetableQuestionController(curfewTimetableService)
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

    it('continues to the curfew timetable page when the answer is no', async () => {
      const order = getMockOrder()
      req = createMockRequest({ order, body: { action: 'continue', standardCurfewTimes: 'NO' } })
      req.flash = jest.fn()

      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/monitoring-conditions/curfew/timetable`)
    })

    it('returns to the order summary when the answer is no and the action is not continue', async () => {
      const order = getMockOrder()
      req = createMockRequest({ order, body: { action: 'back', standardCurfewTimes: 'NO' } })
      req.flash = jest.fn()

      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(res.locals.orderSummaryUri)
    })

    it('saves the standard 19:00-07:00 curfew timetable and continues to the types of monitoring needed page when the answer is yes', async () => {
      const order = getMockOrder({
        curfewConditions: {
          startDate: null,
          endDate: null,
          curfewAddress: '10 Downing Street, London, SW1A 2AA',
          curfewAdditionalDetails: '',
        },
      })
      req = createMockRequest({ order, body: { action: 'continue', standardCurfewTimes: 'YES' } })
      req.flash = jest.fn()

      await controller.update(req, res, next)

      expect(curfewTimetableService.update).toHaveBeenCalledWith({
        accessToken: res.locals.user.token,
        orderId: order.id,
        data: [
          {
            dayOfWeek: 'MONDAY',
            curfewAddress: '10 Downing Street, London, SW1A 2AA',
            startTime: '19:00:00',
            endTime: '07:00:00',
          },
          {
            dayOfWeek: 'TUESDAY',
            curfewAddress: '10 Downing Street, London, SW1A 2AA',
            startTime: '19:00:00',
            endTime: '07:00:00',
          },
          {
            dayOfWeek: 'WEDNESDAY',
            curfewAddress: '10 Downing Street, London, SW1A 2AA',
            startTime: '19:00:00',
            endTime: '07:00:00',
          },
          {
            dayOfWeek: 'THURSDAY',
            curfewAddress: '10 Downing Street, London, SW1A 2AA',
            startTime: '19:00:00',
            endTime: '07:00:00',
          },
          {
            dayOfWeek: 'FRIDAY',
            curfewAddress: '10 Downing Street, London, SW1A 2AA',
            startTime: '19:00:00',
            endTime: '07:00:00',
          },
          {
            dayOfWeek: 'SATURDAY',
            curfewAddress: '10 Downing Street, London, SW1A 2AA',
            startTime: '19:00:00',
            endTime: '07:00:00',
          },
          {
            dayOfWeek: 'SUNDAY',
            curfewAddress: '10 Downing Street, London, SW1A 2AA',
            startTime: '19:00:00',
            endTime: '07:00:00',
          },
        ],
      })
      expect(res.redirect).toHaveBeenCalledWith(
        `/order/${order.id}/monitoring-conditions/order-type-description/types-of-monitoring-needed`,
      )
    })
  })
})
