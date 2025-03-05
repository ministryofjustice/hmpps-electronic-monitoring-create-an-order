import type { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { createMonitoringConditions, getMockOrder } from '../../../test/mocks/mockOrder'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import RestClient from '../../data/restClient'
import AuditService from '../../services/auditService'
import CurfewConditionsService from '../../services/curfewConditionsService'
import CurfewConditionsController from './curfewConditionsController'
import paths from '../../constants/paths'
import TaskListService from '../../services/taskListService'

jest.mock('../../services/auditService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

const mockId = uuidv4()

describe('CurfewConditionsController', () => {
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockCurfewReleaseDateService: jest.Mocked<CurfewConditionsService>
  let controller: CurfewConditionsController
  const taskListService = new TaskListService()
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    mockAuditClient = new HmppsAuditClient({
      queueUrl: '',
      enabled: true,
      region: '',
      serviceName: '',
    }) as jest.Mocked<HmppsAuditClient>
    const mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    mockAuditService = new AuditService(mockAuditClient) as jest.Mocked<AuditService>
    mockCurfewReleaseDateService = new CurfewConditionsService(mockRestClient) as jest.Mocked<CurfewConditionsService>
    controller = new CurfewConditionsController(mockAuditService, mockCurfewReleaseDateService, taskListService)

    req = {
      // @ts-expect-error stubbing session
      session: {},
      query: {},
      params: {
        orderId: mockId,
      },
      order: getMockOrder({ id: mockId }),
      user: {
        username: 'fakeUserName',
        token: 'fakeUserToken',
        authSource: 'auth',
      },
      flash: jest.fn(),
    }

    // @ts-expect-error stubbing res.render
    res = {
      locals: {
        user: {
          username: 'fakeUserName',
          token: 'fakeUserToken',
          authSource: 'nomis',
          userId: 'fakeId',
          name: 'fake user',
          displayName: 'fuser',
          userRoles: ['fakeRole'],
          staffId: 123,
        },
        editable: false,
        orderId: mockId,
      },
      redirect: jest.fn(),
      render: jest.fn(),
    }

    next = jest.fn()
  })

  describe('View curfew conditions', () => {
    it('Should render with formdata and validation errors from flash', async () => {
      const mockValidationError = [
        { field: 'curfewAddress', error: 'mockError' },
        { field: 'startDate', error: 'mock start date Error' },
      ]
      const mockFormData = {
        action: 'continue',
        addresses: ['PRIMARY', 'SECONDARY'],
        'startDate-day': '11',
        'startDate-month': '09',
        'startDate-year': '2024',
        'endDate-day': '11',
        'endDate-month': '09',
        'endDate-year': '2025',
      }
      req.flash = jest.fn().mockReturnValueOnce(mockValidationError).mockReturnValueOnce([mockFormData])

      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/curfew-conditions', {
        addresses: {
          values: ['PRIMARY', 'SECONDARY'],
          error: {
            text: 'mockError',
          },
        },
        startDate: {
          value: {
            year: '2024',
            month: '09',
            day: '11',
          },
          error: {
            text: 'mock start date Error',
          },
        },
        endDate: {
          value: {
            year: '2025',
            month: '09',
            day: '11',
          },
          error: undefined,
        },
        errorSummary: {
          errorList: [
            {
              href: '#curfewAddress',
              text: 'mockError',
            },
            {
              href: '#startDate',
              text: 'mock start date Error',
            },
          ],
          titleText: 'There is a problem',
        },
      })
    })

    it('Should render with order curfewReleaseDateConditions', async () => {
      const mockReleaseDateCondition = {
        curfewAddress: 'PRIMARY,SECONDARY',
        orderId: mockId,
        startDate: '2025-02-15',
        endDate: '2026-02-15',
      }
      req.order = getMockOrder({ id: mockId, curfewConditions: mockReleaseDateCondition })
      req.flash = jest.fn().mockReturnValueOnce([]).mockReturnValueOnce([])
      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/curfew-conditions', {
        addresses: {
          values: ['PRIMARY', 'SECONDARY'],
        },
        startDate: {
          value: {
            hours: '00',
            minutes: '00',
            year: '2025',
            month: '02',
            day: '15',
          },
        },
        endDate: {
          value: {
            hours: '00',
            minutes: '00',
            year: '2026',
            month: '02',
            day: '15',
          },
        },
        errorSummary: null,
      })
    })
  })

  describe('Update curfew conditions', () => {
    it('Should redirect to view and save form and validation error flash when service return validation error', async () => {
      req.body = {
        action: 'continue',
        addresses: ['PRIMARY', 'SECONDARY'],
        'startDate-day': '11',
        'startDate-month': '09',
        'startDate-year': '2024',
        'endDate-day': '11',
        'endDate-month': '09',
        'endDate-year': '2025',
      }
      const mockValidationError = [
        { field: 'curfewAddress', error: 'mockError' },
        { field: 'startDate', error: 'mock start date Error' },
      ]
      mockCurfewReleaseDateService.update = jest.fn().mockResolvedValue(mockValidationError)

      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', mockValidationError)
      expect(req.flash).toHaveBeenCalledWith('formData', req.body)
      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', mockId),
      )
    })

    it('Should redirect to curfew condition page', async () => {
      req.order = getMockOrder({
        id: mockId,
        monitoringConditions: createMonitoringConditions({ curfew: true }),
      })
      req.body = {
        action: 'continue',
        address: ['PRIMARY', 'SECONDARY'],
        'startDate-day': '11',
        'startDate-month': '09',
        'startDate-year': '2024',
        'endDate-day': '11',
        'endDate-month': '09',
        'endDate-year': '2025',
      }
      mockCurfewReleaseDateService.update = jest.fn().mockResolvedValue(undefined)

      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockId}/monitoring-conditions/curfew/timetable`)
    })

    it('Should redirect back to summary page', async () => {
      req.order = getMockOrder({
        id: mockId,
        monitoringConditions: createMonitoringConditions({ curfew: true }),
      })
      req.body = {
        action: 'back',
        address: ['PRIMARY', 'SECONDARY'],
        'startDate-day': '11',
        'startDate-month': '09',
        'startDate-year': '2024',
        'endDate-day': '11',
        'endDate-month': '09',
        'endDate-year': '2025',
      }
      mockCurfewReleaseDateService.update = jest.fn().mockResolvedValue(undefined)

      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockId}/summary`)
    })
  })
})
