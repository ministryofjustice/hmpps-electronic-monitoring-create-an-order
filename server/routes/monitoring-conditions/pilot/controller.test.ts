import { Request, Response, NextFunction } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import PilotController from './controller'
import InMemoryMonitoringConditionsStore from '../store/inMemoryStore'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import { Order } from '../../../models/Order'
import { getMockOrder } from '../../../../test/mocks/mockOrder'
import paths from '../../../constants/paths'

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
    req.flash = jest.fn()

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

  describe('view', () => {
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
              value: 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_HOME_DETENTION_CURFEW_DAPOL_HDC',
            },
            {
              text: 'GPS acquisitive crime',
              value: 'GPS_ACQUISITIVE_CRIME_HOME_DETENTION_CURFEW',
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

    it('validation errors', async () => {
      req.flash = jest.fn().mockReturnValueOnce([
        {
          error: 'Select the type of pilot the device wearer is part of',
          field: 'pilot',
        },
      ])

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          pilot: { value: '', error: { text: 'Select the type of pilot the device wearer is part of' } },
          errorSummary: {
            errorList: [{ href: '#pilot', text: 'Select the type of pilot the device wearer is part of' }],
            titleText: 'There is a problem',
          },
        }),
      )
    })
  })

  describe('update', () => {
    it('validates', async () => {
      req.body = {
        action: 'continue',
      }
      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        { error: 'Select the type of pilot the device wearer is part of', field: 'pilot' },
      ])

      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PILOT.replace(':orderId', req.order!.id),
      )
    })

    it('saves pilot', async () => {
      req.body = {
        action: 'continue',
        pilot: 'ACQUISITIVE_CRIME_PROJECT',
      }
      await controller.update(req, res, next)

      expect(mockMonitoringConditionsStoreService.updateField).toHaveBeenCalledWith(
        req.order?.id,
        'pilot',
        'ACQUISITIVE_CRIME_PROJECT',
      )

      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', req.order!.id),
      )
      // update to PRARR when made
      // expect(res.redirect).toHaveBeenCalledWith(paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR)
    })
  })
})
