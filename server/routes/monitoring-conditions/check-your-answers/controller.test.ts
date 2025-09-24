import type { NextFunction, Request, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import InMemoryMonitoringConditionsStore from '../store/inMemoryStore'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import CheckYourAnswersController from './controller'
import paths from '../../../constants/paths'

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

  it('should render the correct view', async () => {
    const controller = new CheckYourAnswersController(mockMonitoringConditionsStoreService)

    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(
      'pages/order/monitoring-conditions/order-type-description/check-your-answers',
      expect.anything(),
    )
  })

  it('should construct the correct model', async () => {
    mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
      orderType: 'COMMUNITY',
      orderTypeConditions: 'REQUIREMENTS_OF_A_COMMUNITY_ORDER',
    })
    const controller = new CheckYourAnswersController(mockMonitoringConditionsStoreService)

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
