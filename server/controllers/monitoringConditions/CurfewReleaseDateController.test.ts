import type { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import RestClient from '../../data/restClient'
import AuditService from '../../services/auditService'
import CurfewReleaseDateService from '../../services/curfewReleaseDateService'
import CurfewReleaseDateController from './curfewReleaseDateController'
import paths from '../../constants/paths'

jest.mock('../../services/auditService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

const mockId = uuidv4()

describe('CurfewReleaseDateController', () => {
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>

  let mockCurfewReleaseDateService: jest.Mocked<CurfewReleaseDateService>
  let controller: CurfewReleaseDateController
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
    controller = new CurfewReleaseDateController(mockAuditService, mockCurfewReleaseDateService)

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
        action: 'next',
        address: 'PRIMARY',
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
        address: {
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
        curfewTimes: {
          value: {
            startHours: '',
            startMinutes: '',
            endHours: '23',
            endMinutes: '59',
          },
          error: {
            text: 'mock start time Error',
          },
        },
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
      req.order = getMockOrder({ id: mockId, curfewReleaseDateConditions: mockReleaseDateCondition })
      req.flash = jest.fn().mockReturnValueOnce([]).mockReturnValueOnce([])
      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/curfew-release-date', {
        address: {
          value: 'SECONDARY',
        },
        releaseDate: {
          value: {
            year: '2025',
            month: '2',
            day: '15',
          },
        },
        curfewTimes: {
          value: {
            startHours: '19',
            startMinutes: '00',
            endHours: '22',
            endMinutes: '00',
          },
        },
      })
    })
  })

  describe('Update curfew release date', () => {
    it('Should redirect to view and save form and validation error flash when service return validation error', async () => {
      req.body = {
        action: 'next',
        address: 'PRIMARY',
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

    it('Shoud redirect to curfew condition page', async () => {
      req.body = {
        action: 'next',
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

      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', mockId),
      )
    })
  })
})
