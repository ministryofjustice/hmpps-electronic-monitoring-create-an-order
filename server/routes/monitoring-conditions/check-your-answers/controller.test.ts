import type { NextFunction, Request, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import InMemoryMonitoringConditionsStore from '../store/inMemoryStore'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import CheckYourAnswersController from './controller'

jest.mock('../monitoringConditionsStoreService')

describe('check your answers controller', () => {
  let mockDataStore: InMemoryMonitoringConditionsStore
  let mockMonitoringConditionsStoreService: jest.Mocked<MonitoringConditionsStoreService>
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    mockDataStore = new InMemoryMonitoringConditionsStore()
    mockMonitoringConditionsStoreService = new MonitoringConditionsStoreService(
      mockDataStore,
    ) as jest.Mocked<MonitoringConditionsStoreService>
    mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({})

    req = createMockRequest()
    res = createMockResponse()
    next = jest.fn()
  })

  it('should render the correct view', () => {
    const controller = new CheckYourAnswersController(mockMonitoringConditionsStoreService)

    controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(
      'pages/order/monitoring-conditions/order-type-description/check-your-answers',
      expect.anything(),
    )
  })
})
