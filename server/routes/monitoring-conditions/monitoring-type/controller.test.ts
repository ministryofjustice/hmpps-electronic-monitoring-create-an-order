import { Response, Request, NextFunction } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import MonitoringTypeController from './controller'
import constructModel from './viewModel'
import paths from '../../../constants/paths'
import TaskListService from '../../../services/taskListService'

jest.mock('./viewModel')

describe('monitoring type controller', () => {
  const mockTaskListService = {
    getNextCheckYourAnswersPage: jest.fn(),
    getNextPage: jest.fn(),
  } as unknown as jest.Mocked<TaskListService>

  let controller: MonitoringTypeController

  let res: Response
  let req: Request
  let next: NextFunction
  const mockConstructModel = jest.mocked(constructModel)

  beforeEach(() => {
    jest.restoreAllMocks()

    controller = new MonitoringTypeController(mockTaskListService)

    mockConstructModel.mockReturnValue({ errorSummary: null })

    req = createMockRequest()
    req.flash = jest.fn()
    res = createMockResponse()
    next = jest.fn()
  })

  describe('view', () => {
    it('renders the correct view', async () => {
      req.flash = jest.fn().mockResolvedValue([])
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/order-type-description/monitoring-type',
        expect.anything(),
      )
    })
  })

  describe('update', () => {
    it('redirects to the next page', async () => {
      req.body = {
        action: 'continue',
        monitoringType: 'curfew',
      }
      mockTaskListService.getNextPage = jest
        .fn()
        .mockReturnValue(paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', req.order!.id))

      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', req.order!.id),
      )
    })

    it('validates', async () => {
      req.body = {
        action: 'continue',
      }
      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        { error: 'Select monitoring required', field: 'monitoringType' },
      ])
    })
  })
})
