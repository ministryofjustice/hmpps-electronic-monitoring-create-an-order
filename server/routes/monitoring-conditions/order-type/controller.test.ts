import type { NextFunction, Request, Response } from 'express'
import OrderTypeController from './controller'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import InMemoryMonitoringConditionsStore from '../store/inMemoryStore'
import { MonitoringConditions } from '../model'

jest.mock('../monitoringConditionsStoreService')

describe('order type controller', () => {
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

  it('should render the correct view', async () => {
    const controller = new OrderTypeController(mockMonitoringConditionsStoreService)

    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(
      'pages/order/monitoring-conditions/order-type-description/order-type',
      expect.anything(),
    )
  })

  it('should construct the correct model when there is no data in the store', async () => {
    const controller = new OrderTypeController(mockMonitoringConditionsStoreService)

    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(expect.anything(), { orderType: { value: '' }, errorSummary: null })
  })

  it('should construct the correct model when there is data in the store', async () => {
    const data: MonitoringConditions = { orderType: 'COMMUNITY' }
    mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue(data)

    const controller = new OrderTypeController(mockMonitoringConditionsStoreService)

    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(expect.anything(), {
      orderType: { value: 'COMMUNITY' },
      errorSummary: null,
    })
  })
})
