import type { NextFunction, Request, Response } from 'express'
import { createMonitoringConditions, getMockOrder, getMockOrderListInformation } from '../../test/mocks/mockOrder'
import HmppsAuditClient from '../data/hmppsAuditClient'
import RestClient from '../data/restClient'
import { Order, OrderStatusEnum, OrderTypeEnum } from '../models/Order'
import { SanitisedError } from '../sanitisedError'
import AuditService from '../services/auditService'
import OrderSearchService from '../services/orderSearchService'
import OrderSearchController from './orderSearchController'
import { createMockRequest, createMockResponse } from '../../test/mocks/mockExpress'
import { OrderListInformation } from '../models/OrderListInformation'

jest.mock('../services/auditService')
jest.mock('../services/orderSearchService')
jest.mock('../data/hmppsAuditClient')

const mockDate = new Date(2000, 10, 20).toISOString()

const mock500Error: SanitisedError = {
  message: 'Internal Server Error',
  name: 'InternalServerError',
  stack: '',
  status: 500,
}

describe('OrderSearchController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let mockOrderService: jest.Mocked<OrderSearchService>
  let orderController: OrderSearchController
  let req: Request
  let res: Response
  let next: NextFunction
  let mockSubmittedOrder: Order

  beforeEach(() => {
    mockSubmittedOrder = getMockOrder({
      status: OrderStatusEnum.Enum.SUBMITTED,
      type: OrderTypeEnum.Enum.VARIATION,
      deviceWearer: {
        nomisId: null,
        pncId: 'some id number',
        deliusId: null,
        prisonNumber: null,
        homeOfficeReferenceNumber: null,
        complianceAndEnforcementPersonReference: null,
        courtCaseReferenceNumber: null,
        firstName: 'first',
        middleName: null,
        lastName: 'last',
        alias: null,
        dateOfBirth: mockDate,
        adultAtTimeOfInstallation: false,
        sex: null,
        gender: null,
        disabilities: [],
        noFixedAbode: null,
        language: null,
        interpreterRequired: null,
      },
      interestedParties: {
        notifyingOrganisation: 'YOUTH_CUSTODY_SERVICE',
        notifyingOrganisationName: '',
        notifyingOrganisationEmail: 'test@test',
        responsibleOfficerName: 'John Smith',
        responsibleOfficerPhoneNumber: '01234567890',
        responsibleOrganisation: 'HOME_OFFICE',
        responsibleOrganisationEmail: 'test@test.com',
        responsibleOrganisationRegion: '',
      },
      enforcementZoneConditions: [],
      additionalDocuments: [],
      monitoringConditions: createMonitoringConditions({
        startDate: mockDate,
        endDate: mockDate,
      }),
      fmsResultDate: mockDate,
      addresses: [
        {
          addressType: 'PRIMARY',
          addressLine1: '',
          addressLine2: '',
          addressLine3: 'Glossop',
          addressLine4: '',
          postcode: '',
        },
      ],
    })

    mockAuditClient = new HmppsAuditClient({
      queueUrl: '',
      enabled: true,
      region: '',
      serviceName: '',
    }) as jest.Mocked<HmppsAuditClient>
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    mockAuditService = new AuditService(mockAuditClient) as jest.Mocked<AuditService>
    mockOrderService = new OrderSearchService(mockRestClient) as jest.Mocked<OrderSearchService>
    orderController = new OrderSearchController(mockAuditService, mockOrderService)

    req = createMockRequest({
      params: {
        orderId: '123456789',
      },
      user: {
        username: 'fakeUserName',
        token: 'fakeUserToken',
        authSource: 'auth',
      },
    })
    res = createMockResponse()

    next = jest.fn()
  })

  describe('list orders', () => {
    const convertOrderToInformation = (order: Order): OrderListInformation => {
      return {
        id: order.id,
        versionId: order.versionId,
        status: order.status,
        type: order.type,
        firstName: order.deviceWearer.firstName,
        lastName: order.deviceWearer.lastName,
        notifyingOrganisation: order.interestedParties?.notifyingOrganisation,
      }
    }
    it('should render a view containing users orders', async () => {
      const draftWithoutOrg = getMockOrderListInformation()
      const draftWithOrg = getMockOrderListInformation({ notifyingOrganisation: 'PRISON', lastUpdatedBy: 'Bob' })
      mockOrderService.listOrders.mockResolvedValue([draftWithoutOrg, draftWithOrg])

      await orderController.list(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/index',
        expect.objectContaining({
          orders: [
            {
              href: `/order/${draftWithoutOrg.id}/interest-parties/notifying-organisation`,
              index: 0,
              name: 'Not supplied',
              lastUpdatedBy: null,
              lastUpdatedDateTime: '',
              statusTags: [{ type: 'DRAFT', text: 'Draft' }],
            },
            {
              href: `/order/${draftWithOrg.id}/summary`,
              index: 1,
              name: 'Not supplied',
              lastUpdatedBy: 'Bob',
              lastUpdatedDateTime: '',
              statusTags: [{ type: 'DRAFT', text: 'Draft' }],
            },
          ],
        }),
      )
    })

    it('should render a view containing no results if there is an error', async () => {
      mockOrderService.listOrders.mockRejectedValue(mock500Error)

      await orderController.list(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/index',
        expect.objectContaining({
          orders: [],
        }),
      )
    })

    it.each(['PRISON'] as const)(
      // Youth??
      'should pass the requested view to the service and show the filter for %s users',
      async cohort => {
        mockOrderService.listOrders.mockResolvedValue([])
        res.locals.user.cohort = { cohort }
        req.query = { view: 'FAILED_ORDERS' }

        await orderController.list(req, res, next)

        expect(mockOrderService.listOrders).toHaveBeenCalledWith({ accessToken: 'fakeUserToken' }, 'FAILED_ORDERS')
        expect(res.render).toHaveBeenCalledWith(
          'pages/index',
          expect.objectContaining({
            isPrisonOrYouthUser: true,
            viewOptions: [
              { value: 'MY_ORDERS', text: 'My drafts', selected: false },
              { value: 'FAILED_ORDERS', text: 'My failed to submit', selected: true },
              { value: 'PRISON_ORDERS', text: 'My prison drafts', selected: false },
            ],
          }),
        )
      },
    )

    it('should ignore the requested view and hide the filter for other users', async () => {
      mockOrderService.listOrders.mockResolvedValue([])
      res.locals.user.cohort = { cohort: 'PROBATION' }
      req.query = { view: 'PRISON_ORDERS' }

      await orderController.list(req, res, next)

      expect(mockOrderService.listOrders).toHaveBeenCalledWith({ accessToken: 'fakeUserToken' }, 'MY_ORDERS')
      expect(res.render).toHaveBeenCalledWith(
        'pages/index',
        expect.objectContaining({
          isPrisonOrYouthUser: false,
        }),
      )
    })

    it('should fall back to MY_ORDERS when the requested view is not recognised', async () => {
      mockOrderService.listOrders.mockResolvedValue([])
      res.locals.user.cohort = { cohort: 'PRISON' }
      req.query = { view: 'NOT_A_VIEW' }

      await orderController.list(req, res, next)

      expect(mockOrderService.listOrders).toHaveBeenCalledWith({ accessToken: 'fakeUserToken' }, 'MY_ORDERS')
    })
  })
  describe('search orders', () => {
    it('should call the service with the correct search term', async () => {
      mockOrderService.searchOrders.mockResolvedValue([mockSubmittedOrder])
      req.query = { searchTerm: 'firstName' }

      await orderController.search(req, res, next)

      expect(mockOrderService.searchOrders).toHaveBeenCalledWith(expect.objectContaining({ searchTerm: 'firstName' }))
    })

    it('should render a view containing search results', async () => {
      mockOrderService.searchOrders.mockResolvedValue([mockSubmittedOrder])
      req.query = { searchTerm: 'firstName' }

      await orderController.search(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/search',
        expect.objectContaining({
          orders: [
            {
              name: 'first last',
              href: `/order/${mockSubmittedOrder.id}/summary`,
              dob: '20/11/2000',
              youth: 'Youth',
              pins: ['some id number'],
              location: 'Glossop',
              startDate: '20/11/2000',
              endDate: '20/11/2000',
              lastUpdated: '20/11/2000',
              statusTags: [{ text: 'Submitted', type: 'SUBMITTED' }],
            },
          ],
        }),
      )
    })

    it('should render all id numbers', async () => {
      mockSubmittedOrder.deviceWearer.nomisId = 'nomisId'
      mockSubmittedOrder.deviceWearer.pncId = 'pncId'
      mockSubmittedOrder.deviceWearer.deliusId = 'deliusId'
      mockSubmittedOrder.deviceWearer.prisonNumber = 'prisNum'
      mockSubmittedOrder.deviceWearer.complianceAndEnforcementPersonReference = 'cepr'
      mockSubmittedOrder.deviceWearer.courtCaseReferenceNumber = 'ccrn'
      mockOrderService.searchOrders.mockResolvedValue([mockSubmittedOrder])
      req.query = { searchTerm: 'firstName' }

      await orderController.search(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/search',
        expect.objectContaining({
          orders: [
            {
              name: 'first last',
              href: `/order/${mockSubmittedOrder.id}/summary`,
              dob: '20/11/2000',
              youth: 'Youth',
              pins: ['nomisId', 'pncId', 'deliusId', 'prisNum', 'cepr', 'ccrn'],
              location: 'Glossop',
              startDate: '20/11/2000',
              endDate: '20/11/2000',
              lastUpdated: '20/11/2000',
              statusTags: [{ text: 'Submitted', type: 'SUBMITTED' }],
            },
          ],
        }),
      )
    })

    it('should render a view when there are no results', async () => {
      mockOrderService.searchOrders.mockResolvedValue([])
      req.query = { searchTerm: 'firstName' }

      await orderController.search(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/search',
        expect.objectContaining({
          orders: [],
          searchTerm: 'firstName',
          noResults: true,
        }),
      )
    })

    it('should render a view when there is no search term', async () => {
      mockOrderService.searchOrders.mockResolvedValue([])
      req.query = { searchTerm: '' }

      await orderController.search(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/search',
        expect.objectContaining({
          orders: [],
          emptySearch: true,
        }),
      )
    })

    it('should render a view when search term is just whitespace', async () => {
      mockOrderService.searchOrders.mockResolvedValue([])
      req.query = { searchTerm: '       ' }

      await orderController.search(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/search',
        expect.objectContaining({
          orders: [],
          emptySearch: true,
        }),
      )
    })

    it('should render a view when searchTerm is undefined', async () => {
      mockOrderService.searchOrders.mockResolvedValue([])
      req.query = {}

      await orderController.search(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/search', {
        orders: [],
        variationAsNewOrderEnabled: true,
      })
    })
  })
})
