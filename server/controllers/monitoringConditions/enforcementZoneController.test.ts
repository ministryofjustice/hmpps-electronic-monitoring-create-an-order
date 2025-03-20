import type { NextFunction, Request, Response } from 'express'
import { Readable } from 'stream'
import { v4 as uuidv4 } from 'uuid'
import { createMonitoringConditions, getMockOrder } from '../../../test/mocks/mockOrder'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import RestClient from '../../data/restClient'
import EnforcementZoneService from '../../services/enforcementZoneServices'
import AuditService from '../../services/auditService'
import EnforcementZoneTypes from '../../models/EnforcementZoneTypes'
import EnforcementZoneController from './enforcementZoneController'
import { EnforcementZone } from '../../models/EnforcementZone'
import TaskListService from '../../services/taskListService'

jest.mock('../../services/auditService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../services/attachmentService')
jest.mock('../../data/restClient')

const mockId = uuidv4()

describe('EnforcementZoneController', () => {
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockEnforcementZoneService: jest.Mocked<EnforcementZoneService>
  let controller: EnforcementZoneController
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
    mockEnforcementZoneService = new EnforcementZoneService(mockRestClient) as jest.Mocked<EnforcementZoneService>
    controller = new EnforcementZoneController(mockAuditService, mockEnforcementZoneService, taskListService)

    req = {
      // @ts-expect-error stubbing session
      session: {},
      query: {},
      params: {
        orderId: mockId,
      },
      order: getMockOrder({
        id: mockId,
        monitoringConditions: createMonitoringConditions({ mandatoryAttendance: true }),
      }),
      user: {
        username: 'fakeUserName',
        token: 'fakeUserToken',
        authSource: 'auth',
      },
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
      set: jest.fn(),
      send: jest.fn(),
      attachment: jest.fn(),
      on: jest.fn(),
      write: jest.fn(),
      off: jest.fn(),
      end: jest.fn(),
      once: jest.fn(),
      emit: jest.fn(),
    }

    next = jest.fn()
  })

  describe('view enforcement zone', () => {
    it('Should render with zone details', async () => {
      req.order?.enforcementZoneConditions.push(createMockEnforcementZone())
      req.params.zoneId = '0'
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/enforcement-zone', {
        anotherZone: {
          value: 'false',
        },
        description: {
          value: 'MockDescription',
        },
        duration: {
          value: 'MockDuration',
        },
        endDate: {
          value: {
            day: '15',
            month: '2',
            year: '2026',
          },
        },
        file: {
          value: '',
        },
        errorSummary: null,
        startDate: {
          value: {
            day: '15',
            month: '2',
            year: '2025',
          },
        },
      })
    })
  })

  describe('update enforcement zone', () => {
    it('Should render current page with error when service return error when updating enforcement zone', async () => {
      req.params.zoneId = '0'
      req.body = createMockBody()
      mockEnforcementZoneService.updateZone = jest
        .fn()
        .mockReturnValueOnce([{ field: 'duration', error: 'Mock Error' }])
      await controller.update(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/enforcement-zone', {
        anotherZone: {
          error: undefined,
          value: 'false',
        },
        description: {
          error: undefined,
          value: 'MockDescription',
        },
        duration: {
          error: {
            text: 'Mock Error',
          },
          value: 'MockDuration',
        },
        endDate: {
          error: undefined,
          value: {
            day: '15',
            month: '2',
            year: '2026',
          },
        },
        file: {
          error: undefined,
          value: '',
        },
        startDate: {
          error: undefined,
          value: {
            day: '15',
            month: '2',
            year: '2025',
          },
        },
        errorSummary: {
          errorList: [
            {
              href: '#duration',
              text: 'Mock Error',
            },
          ],
          titleText: 'There is a problem',
        },
      })
    })

    it('Should render current page with error when service return error when upload file', async () => {
      req.params.zoneId = '0'
      req.body = createMockBody()
      req.file = {
        filename: '',
        originalname: '',
        encoding: '',
        mimetype: '',
        size: 0,
        stream: new Readable(),
        destination: '',
        fieldname: '',
        path: '',
        buffer: Buffer.from(''),
      }
      mockEnforcementZoneService.uploadZoneAttachment = jest
        .fn()
        .mockReturnValueOnce({ status: null, userMessage: 'Mock Error', developerMessage: null })
      await controller.update(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/enforcement-zone', {
        anotherZone: {
          error: undefined,
          value: 'false',
        },
        description: {
          error: undefined,
          value: 'MockDescription',
        },
        duration: {
          error: undefined,
          value: 'MockDuration',
        },
        endDate: {
          error: undefined,
          value: {
            day: '15',
            month: '2',
            year: '2026',
          },
        },
        file: {
          error: {
            text: 'Mock Error',
          },
          value: '',
        },
        startDate: {
          error: undefined,
          value: {
            day: '15',
            month: '2',
            year: '2025',
          },
        },
        errorSummary: {
          errorList: [
            {
              href: '#file',
              text: 'Mock Error',
            },
          ],
          titleText: 'There is a problem',
        },
      })
    })

    it('Should render new zone page if anotherZone is true', async () => {
      req.params.zoneId = '0'
      req.body = createMockBody('true')
      mockEnforcementZoneService.updateZone = jest.fn().mockReturnValueOnce(null)
      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockId}/monitoring-conditions/zone/1`)
    })

    it('Should render new zone page if action is continue and order enforcementZoneConditions length greater than zoneId', async () => {
      req.params.zoneId = '0'
      req.body = createMockBody('false', 'continue')
      req.order?.enforcementZoneConditions.push(createMockEnforcementZone())
      req.order?.enforcementZoneConditions.push(createMockEnforcementZone(1))
      mockEnforcementZoneService.updateZone = jest.fn().mockReturnValueOnce(null)
      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockId}/monitoring-conditions/zone/1`)
    })

    it('Should render attendance page if action is continue', async () => {
      req.params.zoneId = '0'
      req.body = createMockBody('false', 'continue')
      req.order?.enforcementZoneConditions.push(createMockEnforcementZone())
      mockEnforcementZoneService.updateZone = jest.fn().mockReturnValueOnce(null)
      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockId}/monitoring-conditions/attendance`)
    })

    it('Should logs audit', async () => {
      req.params.zoneId = '0'
      req.body = createMockBody('false', 'continue')
      req.order?.enforcementZoneConditions.push(createMockEnforcementZone())
      mockEnforcementZoneService.updateZone = jest.fn().mockReturnValueOnce(null)
      await controller.update(req, res, next)

      expect(mockAuditService.logAuditEvent).toHaveBeenCalledWith({
        who: 'fakeUserName',
        correlationId: req.order?.id,
        what: 'Updated enforcement zone with zone id : 0',
      })
    })

    it('Should redirect to order summary page', async () => {
      req.params.zoneId = '0'
      req.body = createMockBody('false', 'back')
      req.order?.enforcementZoneConditions.push(createMockEnforcementZone())
      mockEnforcementZoneService.updateZone = jest.fn().mockReturnValueOnce(null)
      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockId}/summary`)
    })
  })
})

const createMockBody = (anotherZone: string = 'false', action: string = 'sumbit'): ZoneFormDataModel => {
  return {
    action,
    startYear: '2025',
    startMonth: '2',
    startDay: '15',
    endYear: '2026',
    endMonth: '2',
    endDay: '15',
    zoneType: EnforcementZoneTypes.EXCLUSION,
    duration: 'MockDuration',
    description: 'MockDescription',
    anotherZone,
  }
}

const createMockEnforcementZone = (zoneId: number = 0): EnforcementZone => {
  return {
    zoneType: EnforcementZoneTypes.EXCLUSION,
    duration: 'MockDuration',
    description: 'MockDescription',
    startDate: '2025-02-15',
    endDate: '2026-02-15',
    zoneId,
    fileId: '',
    fileName: '',
  }
}

type ZoneFormDataModel = {
  action: string
  description: string
  duration: string
  endDay: string
  endMonth: string
  endYear: string
  startDay: string
  startMonth: string
  startYear: string
  zoneType: string
  anotherZone: string
}
