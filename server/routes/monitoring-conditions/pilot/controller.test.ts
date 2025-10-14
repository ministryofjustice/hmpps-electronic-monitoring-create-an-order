import { Request, Response, NextFunction } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import PilotController from './controller'
import InMemoryMonitoringConditionsStore from '../store/inMemoryStore'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import { Order } from '../../../models/Order'
import { getMockOrder } from '../../../../test/mocks/mockOrder'

jest.mock('../monitoringConditionsStoreService')

describe('pilot controller', () => {
  let mockDataStore: InMemoryMonitoringConditionsStore
  let mockMonitoringConditionsStoreService: jest.Mocked<MonitoringConditionsStoreService>
  let mockOrder: Order
  let req: Request
  let res: Response
  let next: NextFunction
  let controller: PilotController

  beforeEach(() => {
    mockDataStore = new InMemoryMonitoringConditionsStore()
    mockMonitoringConditionsStoreService = new MonitoringConditionsStoreService(
      mockDataStore,
    ) as jest.Mocked<MonitoringConditionsStoreService>
    mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({})
    controller = new PilotController(mockMonitoringConditionsStoreService)

    mockOrder = getMockOrder()

    req = createMockRequest()
    req.order = mockOrder

    res = createMockResponse()
    next = jest.fn()
  })

  it('calls render with the correct view', async () => {
    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(
      'pages/order/monitoring-conditions/order-type-description/pilot',
      expect.anything(),
    )
  })

  it('should contruct the correct model when store data has no pilot', async () => {
    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(expect.anything(), { pilot: { value: '' }, errorSummary: null })
  })

  it('should contruct the correct model when store data has a pilot', async () => {
    mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
      pilot: 'ACQUISITIVE_CRIME_PROJECT',
    })

    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(expect.anything(), {
      pilot: { value: 'ACQUISITIVE_CRIME_PROJECT' },
      errorSummary: null,
    })
  })
})
