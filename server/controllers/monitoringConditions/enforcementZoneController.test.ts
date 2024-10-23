import type { NextFunction, Request, Response } from 'express'
import { Readable } from 'stream'
import { v4 as uuidv4 } from 'uuid'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import RestClient from '../../data/restClient'
import EnforcementZoneService from '../../services/enforcementZoneServices'
import AuditService from '../../services/auditService'
import EnforcementZoneTypes from '../../models/EnforcementZoneTypes'
import EnforcementZoneController from './enforcementZoneController'
import { EnforcementZone } from '../../models/EnforcementZone'

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
    controller = new EnforcementZoneController(mockAuditService, mockEnforcementZoneService)

    req = {
      // @ts-expect-error stubbing session
      session: {},
      query: {},
      params: {
        orderId: mockId,
      },
      order: getMockOrder({
        id: mockId,
        monitoringConditions: {
          orderType: '',
          acquisitiveCrime: true,
          alcohol: false,
          curfew: false,
          dapol: false,
          mandatoryAttendance: true,
          devicesRequired: [],
          exclusionZone: false,
          trail: false,
        },
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

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/enforcement-zone',
        expect.objectContaining({
          zone: {
            ...createMockRenderZone(),
            startDate: '2025-02-15',
            endDate: '2026-02-15',
            zoneId: 0,
            fileId: '',
            fileName: '',
          },
        }),
      )
    })
  })

  describe('update enforcement zone', () => {
    it('Should render current page with error when service return error when updating enforcement zone', async () => {
      req.params.zoneId = '0'
      req.body = createMockBody()
      mockEnforcementZoneService.updateZone = jest.fn().mockReturnValueOnce([{ field: 'mock', error: 'mockerror' }])
      await controller.update(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/enforcement-zone',
        expect.objectContaining({
          zone: createMockRenderZoneWithAnotherZone(),
          error: {
            mock: { text: 'mockerror' },
          },
        }),
      )
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

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/enforcement-zone',
        expect.objectContaining({
          zone: createMockRenderZoneWithAnotherZone(),
          error: {
            file: { text: 'Mock Error' },
          },
        }),
      )
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

const createMockRenderZone = (): RenderZone => {
  return {
    startYear: '2025',
    startMonth: '2',
    startDay: '15',
    endYear: '2026',
    endMonth: '2',
    endDay: '15',
    zoneType: EnforcementZoneTypes.EXCLUSION,
    duration: 'MockDuration',
    description: 'MockDescription',
  }
}
const createMockRenderZoneWithAnotherZone = (): RenderZone => {
  return {
    ...createMockRenderZone(),
    anotherZone: 'false',
  }
}

type RenderZone = {
  startYear: string
  startMonth: string
  startDay: string
  endYear: string
  endMonth: string
  endDay: string
  zoneType: EnforcementZoneTypes
  duration: string
  description: string
  anotherZone?: string
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
