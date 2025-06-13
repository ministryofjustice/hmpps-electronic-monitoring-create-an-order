import type { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { createMonitoringConditions, getMockOrder } from '../../../test/mocks/mockOrder'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import RestClient from '../../data/restClient'
import AuditService from '../../services/auditService'
import TaskListService from '../../services/taskListService'
import CurfewAdditionalDetailsService from '../../services/curfewAdditionalDetailsService'
import CurfewAdditionalDetailsController from './curfewAdditionalDetailsController'
import curfewAdditionalDetails from '../../models/view-models/curfewAdditionalDetails'
import { ValidationError } from '../../models/Validation'

jest.mock('../../services/auditService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

const mockId = uuidv4()

describe('CurfewConditionsController', () => {
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockCurfewAdditionalDetailsService: jest.Mocked<CurfewAdditionalDetailsService>
  let controller: CurfewAdditionalDetailsController
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
    mockCurfewAdditionalDetailsService = new CurfewAdditionalDetailsService(
      mockRestClient,
    ) as jest.Mocked<CurfewAdditionalDetailsService>

    controller = new CurfewAdditionalDetailsController(
      mockAuditService,
      mockCurfewAdditionalDetailsService,
      taskListService,
    )

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

  describe('View curfew additional details with form data', () => {
    it('Should render when form data is empty', async () => {
      const mockFormData = { curfewAdditionalDetails: '' }
      req.flash = jest.fn().mockReturnValueOnce([mockFormData]).mockReturnValueOnce([])

      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/curfew-additional-details', {
        curfewAdditionalDetails: {
          value: '',
        },
        errorSummary: null,
      })
    })

    it('Should render when form data has value', async () => {
      const mockFormData = { curfewAdditionalDetails: 'some details' }
      req.flash = jest.fn().mockReturnValueOnce([mockFormData]).mockReturnValueOnce([])

      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/curfew-additional-details', {
        curfewAdditionalDetails: {
          value: '',
        },
        errorSummary: null,
      })
    })

    it('Should render when there is a no detail error', async () => {
      const mockFormData = { curfewAdditionalDetails: '' }
      const error: ValidationError = { error: 'blah', field: 'details' }
      req.flash = jest.fn().mockReturnValueOnce([mockFormData]).mockReturnValueOnce([error])

      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/curfew-additional-details', {
        curfewAdditionalDetails: {
          value: '',
          error: undefined,
        },
        details: {
          value: '',
          error: {
            text: 'blah',
          },
        },
        errorSummary: expect.anything(),
      })
    })

    it('Should render when there is a empty curfew details error', async () => {
      const mockFormData = { curfewAdditionalDetails: '' }
      const error: ValidationError = { error: 'empty curfew details', field: 'curfewAdditionalDetails' }
      req.flash = jest.fn().mockReturnValueOnce([mockFormData]).mockReturnValueOnce([error])

      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/curfew-additional-details', {
        curfewAdditionalDetails: {
          value: '',
          error: {
            text: 'empty curfew details',
          },
        },
        details: {
          value: '',
          error: undefined,
        },
        errorSummary: expect.anything(),
      })
    })
  })

  describe('View curfew additional details with view model', () => {
    it('Should render when form data is empty', async () => {
      req.flash = jest.fn().mockReturnValueOnce([]).mockReturnValueOnce([])
      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/curfew-additional-details', {
        curfewAdditionalDetails: {
          value: '',
        },
        errorSummary: null,
      })
    })

    it('Should render when form data has value', async () => {
      req.flash = jest.fn().mockReturnValueOnce([]).mockReturnValueOnce([])
      req.order!.curfewConditions = {
        startDate: '',
        endDate: '',
        curfewAddress: '',
        curfewAdditionalDetails: 'some details',
      }

      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/curfew-additional-details', {
        curfewAdditionalDetails: {
          value: 'some details',
        },
        errorSummary: null,
      })
    })

    describe('Update curfew additional details', () => {
      it('Should redirect to next page when action is continue', async () => {
        req.order = getMockOrder({
          id: mockId,
          monitoringConditions: createMonitoringConditions({ curfew: true }),
        })
        req.body = {
          action: 'continue',
          curfewAdditionalDetails: 'some details',
        }
        mockCurfewAdditionalDetailsService.update = jest.fn().mockResolvedValue(undefined)

        await controller.update(req, res, next)

        expect(res.redirect).toHaveBeenCalledWith(`/order/${mockId}/monitoring-conditions/curfew/timetable`)
      })

      it('Should redirect to summary when action is back', async () => {
        req.order = getMockOrder({
          id: mockId,
          monitoringConditions: createMonitoringConditions({ curfew: true }),
        })
        req.body = {
          action: 'back',
          curfewAdditionalDetails: 'some details',
        }
        mockCurfewAdditionalDetailsService.update = jest.fn().mockResolvedValue(undefined)

        await controller.update(req, res, next)

        expect(res.redirect).toHaveBeenCalledWith(`/order/${mockId}/summary`)
      })

      it('Should redirect back to same page when there are errors', async () => {
        req.order = getMockOrder({
          id: mockId,
          monitoringConditions: createMonitoringConditions({ curfew: true }),
        })
        req.body = {
          action: 'continue',
          curfewAdditionalDetails: 'some details',
        }
        const mockValidationError = [{ field: 'curfewAdditionalDetails', error: 'mockError' }]
        mockCurfewAdditionalDetailsService.update = jest.fn().mockResolvedValue(mockValidationError)

        await controller.update(req, res, next)

        expect(res.redirect).toHaveBeenCalledWith(`/order/${mockId}/monitoring-conditions/curfew/additional-details`)
      })
    })
  })
})
