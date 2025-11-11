import type { NextFunction, Request, Response } from 'express'
import { Readable } from 'stream'
import { v4 as uuidv4 } from 'uuid'
import { createMonitoringConditions, getMockOrder } from '../../../../test/mocks/mockOrder'
import HmppsAuditClient from '../../../data/hmppsAuditClient'
import RestClient from '../../../data/restClient'
import EnforcementZoneAddToListService from './service'
import AuditService from '../../../services/auditService'
import EnforcementZoneTypes from '../../../models/EnforcementZoneTypes'
import EnforcementZoneAddToListController from './controller'
import { EnforcementZone } from '../../../models/EnforcementZone'
import TaskListService from '../../../services/taskListService'

jest.mock('../../../services/auditService')
jest.mock('../../../data/hmppsAuditClient')
jest.mock('../../../services/attachmentService')
jest.mock('../../../data/restClient')

const mockId = uuidv4()

describe('EnforcementZoneAddToListController', () => {
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockEnforcementZoneAddToListService: jest.Mocked<EnforcementZoneAddToListService>
  let controller: EnforcementZoneAddToListController

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
    mockEnforcementZoneAddToListService = new EnforcementZoneAddToListService(
      mockRestClient,
    ) as jest.Mocked<EnforcementZoneAddToListService>
    controller = new EnforcementZoneAddToListController(mockAuditService, mockEnforcementZoneAddToListService)

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

      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/enforcement-zone-add-to-list', {
        description: {
          value: 'MockDescription',
        },
        duration: {
          value: 'MockDuration',
        },
        name: {
          value: 'MockName',
        },
        endDate: {
          value: {
            day: '15',
            month: '02',
            year: '2026',
            hours: '23',
            minutes: '59',
          },
        },
        file: {
          value: '',
        },
        errorSummary: null,
        startDate: {
          value: {
            day: '15',
            month: '02',
            year: '2025',
            hours: '00',
            minutes: '00',
          },
        },
      })
    })
  })

  describe('update enforcement zone', () => {
    it('Should render current page with error when service returns error when updating enforcement zone', async () => {
      req.params.zoneId = '0'
      req.body = createMockBody()
      mockEnforcementZoneAddToListService.updateZone = jest
        .fn()
        .mockReturnValueOnce([{ field: 'duration', error: 'Mock Error' }])
      await controller.update(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/enforcement-zone-add-to-list', {
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
        name: {
          error: undefined,
          value: 'MockName',
        },
        endDate: {
          error: undefined,
          value: {
            day: '15',
            month: '02',
            year: '2026',
            hours: '23',
            minutes: '59',
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
            month: '02',
            year: '2025',
            hours: '00',
            minutes: '00',
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

    it('Should render current page with error when service returns error when upload file', async () => {
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
      mockEnforcementZoneAddToListService.uploadZoneAttachment = jest
        .fn()
        .mockReturnValueOnce({ status: null, userMessage: 'Mock Error', developerMessage: null })
      await controller.update(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/enforcement-zone-add-to-list', {
        description: {
          error: undefined,
          value: 'MockDescription',
        },
        duration: {
          error: undefined,
          value: 'MockDuration',
        },
        name: {
          error: undefined,
          value: 'MockName',
        },
        endDate: {
          error: undefined,
          value: {
            day: '15',
            month: '02',
            year: '2026',
            hours: '23',
            minutes: '59',
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
            month: '02',
            year: '2025',
            hours: '00',
            minutes: '00',
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

    // TO-DO: check routing for ELM-4162
    it('Should render types of monitoring page if action is continue', async () => {
      req.params.zoneId = '0'
      req.body = createMockBody('continue')
      req.order?.enforcementZoneConditions.push(createMockEnforcementZone())
      mockEnforcementZoneAddToListService.updateZone = jest.fn().mockReturnValueOnce(null)
      taskListService.getNextPage = jest.fn().mockReturnValue(`/order/${mockId}/monitoring-conditions/attendance`)
      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        `/order/${mockId}/monitoring-conditions/order-type-description/types-of-monitoring-needed`,
      )
    })

    it('Should logs audit', async () => {
      req.params.zoneId = '0'
      req.body = createMockBody('continue')
      req.order?.enforcementZoneConditions.push(createMockEnforcementZone())
      mockEnforcementZoneAddToListService.updateZone = jest.fn().mockReturnValueOnce(null)
      await controller.update(req, res, next)

      expect(mockAuditService.logAuditEvent).toHaveBeenCalledWith({
        who: 'fakeUserName',
        correlationId: req.order?.id,
        what: 'Updated enforcement zone with zone id : 0',
      })
    })

    it('Should redirect to order summary page', async () => {
      req.params.zoneId = '0'
      req.body = createMockBody('back')
      req.order?.enforcementZoneConditions.push(createMockEnforcementZone())
      mockEnforcementZoneAddToListService.updateZone = jest.fn().mockReturnValueOnce(null)
      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockId}/summary`)
    })
  })
})

const createMockBody = (action: string = 'submit'): ZoneAddToListFormDataModel => {
  return {
    action,
    startDate: {
      day: '15',
      month: '02',
      year: '2025',
      hours: '00',
      minutes: '00',
    },
    endDate: {
      day: '15',
      month: '02',
      year: '2026',
      hours: '23',
      minutes: '59',
    },
    zoneType: EnforcementZoneTypes.EXCLUSION,
    name: 'MockName',
    duration: 'MockDuration',
    description: 'MockDescription',
  }
}

const createMockEnforcementZone = (zoneId: number = 0): EnforcementZone => {
  return {
    zoneType: EnforcementZoneTypes.EXCLUSION,
    duration: 'MockDuration',
    description: 'MockDescription',
    startDate: '2025-02-15T00:00:00',
    endDate: '2026-02-15T23:59:00',
    name: 'MockName',
    zoneId,
    fileId: '',
    fileName: '',
  }
}

type ZoneAddToListFormDataModel = {
  action: string
  description: string
  duration: string
  name: string
  startDate: DateTimeModel
  endDate: DateTimeModel
  zoneType: string
}

type DateTimeModel = {
  day: string
  month: string
  year: string
  hours: string
  minutes: string
}
