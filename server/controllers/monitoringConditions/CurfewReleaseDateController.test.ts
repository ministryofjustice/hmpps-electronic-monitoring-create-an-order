import type { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { createMonitoringConditions, getMockOrder } from '../../../test/mocks/mockOrder'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import RestClient from '../../data/restClient'
import AuditService from '../../services/auditService'
import CurfewReleaseDateService from '../../services/curfewReleaseDateService'
import CurfewReleaseDateController from './curfewReleaseDateController'
import paths from '../../constants/paths'
import TaskListService from '../../services/taskListService'

jest.mock('../../services/auditService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

const mockId = uuidv4()

describe('CurfewReleaseDateController', () => {
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockCurfewReleaseDateService: jest.Mocked<CurfewReleaseDateService>
  let controller: CurfewReleaseDateController
  const taskListService = {
    getSections: jest.fn().mockReturnValue(Promise.resolve([])),
  } as unknown as jest.Mocked<TaskListService>
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
    mockCurfewReleaseDateService = new CurfewReleaseDateService(mockRestClient) as jest.Mocked<CurfewReleaseDateService>
    controller = new CurfewReleaseDateController(mockAuditService, mockCurfewReleaseDateService, taskListService)

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

  describe('View curfew release date', () => {
    it('Should render with formdata and validation errors from flash', async () => {
      const mockValidationError = [
        { field: 'curfewAddress', error: 'mockError' },
        { field: 'startTime', error: 'mock start time Error' },
      ]
      const mockFormData = {
        action: 'continue',
        curfewAddress: 'PRIMARY',
        releaseDateDay: '11',
        releaseDateMonth: '09',
        releaseDateYear: '2025',
        curfewTimesStartHours: '',
        curfewTimesStartMinutes: '',
        curfewTimesEndHours: '23',
        curfewTimesEndMinutes: '59',
      }
      req.flash = jest.fn().mockReturnValueOnce(mockValidationError).mockReturnValueOnce([mockFormData])

      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/curfew-release-date', {
        curfewAddress: {
          value: 'PRIMARY',
          error: {
            text: 'mockError',
          },
        },
        releaseDate: {
          value: {
            year: '2025',
            month: '09',
            day: '11',
          },
        },
        curfewEndTime: {
          value: {
            hours: '23',
            minutes: '59',
          },
        },
        curfewStartTime: {
          value: {
            hours: '',
            minutes: '',
          },
          error: {
            text: 'mock start time Error',
          },
        },
        errorSummary: {
          errorList: [
            {
              href: '#startTime',
              text: 'mock start time Error',
            },
            {
              href: '#curfewAddress',
              text: 'mockError',
            },
          ],
          titleText: 'There is a problem',
        },
        primaryAddressView: { value: '' },
        secondaryAddressView: { value: '' },
        tertiaryAddressView: { value: '' },
      })
    })

    it('Should render with order curfewReleaseDateConditions', async () => {
      const mockReleaseDateCondition = {
        curfewAddress: 'SECONDARY',
        orderId: mockId,
        releaseDate: '2025-02-15',
        startTime: '19:00:00',
        endTime: '22:00:00',
      }
      req.order = getMockOrder({
        id: mockId,
        curfewReleaseDateConditions: mockReleaseDateCondition,
        addresses: [
          {
            addressType: 'PRIMARY',
            addressLine1: '10 Downing Street',
            addressLine2: '',
            addressLine3: '',
            addressLine4: '',
            postcode: '',
          },
          {
            addressType: 'SECONDARY',
            addressLine1: '11 Downing Street',
            addressLine2: '',
            addressLine3: '',
            addressLine4: '',
            postcode: '',
          },
          {
            addressType: 'TERTIARY',
            addressLine1: '12 Downing Street',
            addressLine2: '',
            addressLine3: '',
            addressLine4: '',
            postcode: '',
          },
        ],
      })
      req.flash = jest.fn().mockReturnValueOnce([]).mockReturnValueOnce([])
      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/curfew-release-date', {
        curfewAddress: {
          value: 'SECONDARY',
        },
        releaseDate: {
          value: {
            hours: '00',
            minutes: '00',
            year: '2025',
            month: '02',
            day: '15',
          },
        },
        curfewEndTime: {
          value: {
            hours: '22',
            minutes: '00',
          },
        },
        curfewStartTime: {
          value: {
            hours: '19',
            minutes: '00',
          },
        },
        primaryAddressView: { value: '10 Downing Street' },
        secondaryAddressView: { value: '11 Downing Street' },
        tertiaryAddressView: { value: '12 Downing Street' },
        errorSummary: null,
      })
    })
  })

  describe('Update curfew release date', () => {
    it('Should redirect to view and save form and validation error flash when service return validation error', async () => {
      req.body = {
        action: 'continue',
        curfewAddress: 'PRIMARY',
        releaseDateDay: '11',
        releaseDateMonth: '09',
        releaseDateYear: '2025',
        curfewTimesStartHours: '',
        curfewTimesStartMinutes: '',
        curfewTimesEndHours: '23',
        curfewTimesEndMinutes: '59',
      }
      const mockValidationError = [
        { field: 'curfewAddress', error: 'mockError' },
        { field: 'startTime', error: 'mock start time Error' },
      ]
      mockCurfewReleaseDateService.update = jest.fn().mockResolvedValue(mockValidationError)

      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', mockValidationError)
      expect(req.flash).toHaveBeenCalledWith('formData', [req.body])
      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', mockId),
      )
    })

    it('Should redirect to curfew condition page', async () => {
      req.order = getMockOrder({
        id: mockId,
        monitoringConditions: createMonitoringConditions({ curfew: true }),
      })
      req.body = {
        action: 'continue',
        address: 'PRIMARY',
        releaseDateDay: '11',
        releaseDateMonth: '09',
        releaseDateYear: '2025',
        curfewTimesStartHours: '19',
        curfewTimesStartMinutes: '00',
        curfewTimesEndHours: '23',
        curfewTimesEndMinutes: '59',
      }
      mockCurfewReleaseDateService.update = jest.fn().mockResolvedValue(undefined)
      taskListService.getNextPage = jest
        .fn()
        .mockReturnValue(`/order/${mockId}/monitoring-conditions/curfew/conditions`)
      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockId}/monitoring-conditions/curfew/conditions`)
    })

    it('Should redirect back to summary page', async () => {
      req.order = getMockOrder({
        id: mockId,
        monitoringConditions: createMonitoringConditions({ curfew: true }),
      })
      req.body = {
        action: 'back',
        address: 'PRIMARY',
        releaseDateDay: '11',
        releaseDateMonth: '09',
        releaseDateYear: '2025',
        curfewTimesStartHours: '19',
        curfewTimesStartMinutes: '00',
        curfewTimesEndHours: '23',
        curfewTimesEndMinutes: '59',
      }
      mockCurfewReleaseDateService.update = jest.fn().mockResolvedValue(undefined)

      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockId}/summary`)
    })
  })
})
