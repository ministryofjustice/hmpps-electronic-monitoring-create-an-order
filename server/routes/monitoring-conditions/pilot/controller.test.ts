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

  it('no pilot in store', async () => {
    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ pilot: { value: '' } }))
  })

  it('pilot in store', async () => {
    mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
      pilot: 'ACQUISITIVE_CRIME_PROJECT',
    })

    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        pilot: { value: 'ACQUISITIVE_CRIME_PROJECT' },
      }),
    )
  })

  it('hdc yes questions', async () => {
    mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
      hdc: 'YES',
    })

    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        items: [
          {
            text: 'Domestic Abuse Perpetrator on Licence (DAPOL)',
            value: 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_DAPOL',
          },
          {
            text: 'GPS acquisitive crime',
            value: 'GPS_ACQUISITIVE_CRIME_PAROLE',
          },
          {
            divider: 'or',
          },
          {
            text: 'They are not part of any of these pilots',
            value: 'UNKNOWN',
          },
        ],
      }),
    )
  })
  it('hdc no questions', async () => {
    mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
      hdc: 'NO',
    })

    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        items: [
          {
            text: 'Domestic Abuse Perpetrator on Licence (DAPOL)',
            value: 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_DAPOL',
          },
          {
            text: 'GPS acquisitive crime',
            value: 'GPS_ACQUISITIVE_CRIME_PAROLE',
          },
          {
            divider: 'or',
          },
          {
            text: 'They are not part of any of these pilots',
            value: 'UNKNOWN',
            hint: {
              text: 'To be eligible for tagging the device wearer must either be part of a pilot or have Alcohol Monitoring on Licence (AML) as a licence condition.',
            },
          },
        ],
      }),
    )
  })
})
