import { Response, Request, NextFunction } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import PrarrController from './controller'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import InMemoryStore from '../store/inMemoryStore'
import constructModel from './viewModel'

jest.mock('../monitoringConditionsStoreService')
jest.mock('./viewModel')

describe('prarr controller', () => {
  let mockDataStore: InMemoryStore
  let mockStore: jest.Mocked<MonitoringConditionsStoreService>
  let controller: PrarrController
  let res: Response
  let req: Request
  let next: NextFunction
  const mockConstructModel = jest.mocked(constructModel)

  beforeEach(() => {
    jest.restoreAllMocks()
    mockDataStore = new InMemoryStore()
    mockStore = new MonitoringConditionsStoreService(mockDataStore) as jest.Mocked<MonitoringConditionsStoreService>
    mockStore.getMonitoringConditions.mockResolvedValue({})
    controller = new PrarrController(mockStore)

    mockConstructModel.mockReturnValue({})

    req = createMockRequest()
    res = createMockResponse()
    next = jest.fn()
  })

  describe('view', () => {
    it('renders the correct view', async () => {
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/order-type-description/prarr',
        expect.anything(),
      )
    })

    it('render with the model', async () => {
      mockStore.getMonitoringConditions.mockResolvedValue({ prarr: 'YES' })
      mockConstructModel.mockReturnValueOnce({ field: 'value' })

      await controller.view(req, res, next)

      expect(constructModel).toHaveBeenCalledWith({ prarr: 'YES' }, [])

      expect(res.render).toHaveBeenCalledWith(expect.anything(), { field: 'value' })
    })
  })
})
