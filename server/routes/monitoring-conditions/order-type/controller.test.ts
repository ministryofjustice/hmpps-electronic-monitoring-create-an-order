import type { NextFunction, Request, Response } from 'express'
import OrderTypeController from './controller'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import InMemoryMonitoringConditionsStore from '../store/inMemoryStore'
import { MonitoringConditions } from '../model'
import { getMockOrder } from '../../../../test/mocks/mockOrder'
import { Order } from '../../../models/Order'
import { InterestedParties } from '../../../models/InterestedParties'
import { OrderTypeModel } from './model'

jest.mock('../monitoringConditionsStoreService')

const createInterestedParties = (overrides: Partial<InterestedParties>): InterestedParties => {
  return {
    notifyingOrganisation: 'PRISON',
    notifyingOrganisationName: '',
    notifyingOrganisationEmail: '',
    responsibleOfficerName: '',
    responsibleOfficerPhoneNumber: '',
    responsibleOrganisation: 'HOME_OFFICE',
    responsibleOrganisationRegion: '',
    responsibleOrganisationEmail: '',
    ...overrides,
  }
}

describe('order type controller', () => {
  let mockDataStore: InMemoryMonitoringConditionsStore
  let mockMonitoringConditionsStoreService: jest.Mocked<MonitoringConditionsStoreService>
  let mockOrder: Order
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    mockDataStore = new InMemoryMonitoringConditionsStore()
    mockMonitoringConditionsStoreService = new MonitoringConditionsStoreService(
      mockDataStore,
    ) as jest.Mocked<MonitoringConditionsStoreService>
    mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({})

    mockOrder = getMockOrder()

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

  it('should construct the correct model when notifying org is probation', async () => {
    mockOrder.interestedParties = createInterestedParties({ notifyingOrganisation: 'PROBATION' })
    req.order = mockOrder
    const controller = new OrderTypeController(mockMonitoringConditionsStoreService)

    await controller.view(req, res, next)

    const expectedViewObject: OrderTypeModel = {
      orderTypeQuestions: [
        {
          question: 'Release from prison',
          hint: 'Monitoring is a condition of being released from prison following a custodial sentence.',
          value: 'Post Release',
        },
        {
          question: 'Community',
          hint: 'Monitoring is a condition of a court order where they were convicted of a crime, but received a community rather than custodial sentence.',
          value: 'Community',
        },
      ],
      orderType: { value: '' },
      errorSummary: null,
    }

    expect(res.render).toHaveBeenCalledWith(expect.anything(), expectedViewObject)
  })
})
