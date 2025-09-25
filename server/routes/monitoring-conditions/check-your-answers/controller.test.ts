import type { NextFunction, Request, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import InMemoryMonitoringConditionsStore from '../store/inMemoryStore'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import CheckYourAnswersController from './controller'
import paths from '../../../constants/paths'
import RestClient from '../../../data/restClient'
import MonitoringConditionsUpdateService from '../monitoringConditionsService'

jest.mock('../monitoringConditionsStoreService')
jest.mock('../monitoringConditionsService')
jest.mock('../../../data/restClient')

describe('check your answers controller', () => {
  let mockDataStore: InMemoryMonitoringConditionsStore
  let mockMonitoringConditionsStoreService: jest.Mocked<MonitoringConditionsStoreService>
  let mockMonitoringConditionsService: jest.Mocked<MonitoringConditionsUpdateService>
  let mockRestClient: jest.Mocked<RestClient>
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    mockDataStore = new InMemoryMonitoringConditionsStore()
    mockMonitoringConditionsStoreService = new MonitoringConditionsStoreService(
      mockDataStore,
    ) as jest.Mocked<MonitoringConditionsStoreService>
    mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({})
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>

    mockMonitoringConditionsService = new MonitoringConditionsUpdateService(
      mockRestClient,
    ) as jest.Mocked<MonitoringConditionsUpdateService>

    req = createMockRequest()
    res = createMockResponse()
    next = jest.fn()
  })

  describe('view', () => {
    it('should render the correct view', async () => {
      const controller = new CheckYourAnswersController(
        mockMonitoringConditionsStoreService,
        mockMonitoringConditionsService,
      )

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/order-type-description/check-your-answers',
        expect.anything(),
      )
    })

    it('should construct the correct model', async () => {
      mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
        orderType: 'COMMUNITY',
        conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
      })
      const controller = new CheckYourAnswersController(
        mockMonitoringConditionsStoreService,
        mockMonitoringConditionsService,
      )

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(expect.anything(), {
        answers: [
          {
            key: {
              text: 'What is the order type?',
            },
            value: { text: 'Community' },
            actions: {
              items: [
                {
                  href: `${paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION}/order-type`.replace(
                    ':orderId',
                    req.order!.id,
                  ),
                  text: 'Change',
                  visuallyHiddenText: 'What is the order type?'.toLowerCase(),
                },
              ],
            },
          },
        ],
      })
    })
  })
  describe('update', () => {
    it('should submit the monitoring conditions', async () => {
      mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
        orderType: 'COMMUNITY',
        conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
      })

      const controller = new CheckYourAnswersController(
        mockMonitoringConditionsStoreService,
        mockMonitoringConditionsService,
      )

      await controller.update(req, res, next)

      expect(mockMonitoringConditionsService.updateMonitoringConditions).toHaveBeenCalled()
    })
  })
})
