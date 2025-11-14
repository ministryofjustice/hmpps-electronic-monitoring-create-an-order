import { Request, Response, NextFunction } from 'express'
import { createMockRequest, createMockResponse } from '../../../../../test/mocks/mockExpress'
import PilotController from './controller'
import InMemoryMonitoringConditionsStore from '../store/inMemoryStore'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import { Order } from '../../../../models/Order'
import { getMockOrder } from '../../../../../test/mocks/mockOrder'
import paths from '../../../../constants/paths'

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

    mockOrder = {
      ...mockOrder,
      interestedParties: {
        notifyingOrganisation: 'PRISON',
        notifyingOrganisationName: 'FELTHAM_YOUNG_OFFENDER_INSTITUTION',
        notifyingOrganisationEmail: 'test@test.com',
        responsibleOfficerName: 'John Smith',
        responsibleOfficerPhoneNumber: '01234567890',
        responsibleOrganisation: 'PROBATION',
        responsibleOrganisationRegion: 'YORKSHIRE_AND_THE_HUMBER',
        responsibleOrganisationEmail: 'test2@test.com',
      },
    }

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
              disabled: true,
              text: 'Domestic Abuse Perpetrator on Licence (DAPOL)',
              value: 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_HOME_DETENTION_CURFEW_DAPOL_HDC',
            },
            {
              text: 'GPS acquisitive crime (EMAC)',
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
          message:
            'The device wearer is being managed by the Yorkshire and the Humber probation region. To be eligible for the DAPOL pilot they must be managed by an in-scope region. Any queries around pilot eligibility need to be raised with the appropriate COM.',
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
              disabled: true,
              text: 'Domestic Abuse Perpetrator on Licence (DAPOL)',
              value: 'DOMESTIC_ABUSE_PERPETRATOR_ON_LICENCE_DAPOL',
            },
            {
              text: 'GPS acquisitive crime (EMAC)',
              value: 'GPS_ACQUISITIVE_CRIME_PAROLE',
            },
            {
              divider: 'or',
            },
            {
              text: 'They are not part of any of these pilots',
              value: 'UNKNOWN',
              conditional: {
                html: 'To be eligible for tagging the device wearer must either be part of a pilot or have Alcohol Monitoring on Licence (AML) as a licence condition.',
              },
            },
          ],
          message:
            'The device wearer is being managed by the Yorkshire and the Humber probation region. To be eligible for the DAPOL pilot they must be managed by an in-scope region. Any queries around pilot eligibility need to be raised with the appropriate COM.',
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
        req.order,
        'pilot',
        'ACQUISITIVE_CRIME_PROJECT',
      )

      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR.replace(':orderId', req.order!.id),
      )
    })

    it('redirects to offence type if gps acquisitive crime', async () => {
      req.body = {
        action: 'continue',
        pilot: 'GPS_ACQUISITIVE_CRIME_PAROLE',
      }
      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.OFFENCE_TYPE.replace(':orderId', req.order!.id),
      )
    })
  })
})
