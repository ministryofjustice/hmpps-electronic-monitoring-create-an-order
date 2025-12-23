import type { NextFunction, Request, Response } from 'express'
import { createMonitoringConditions, getMockOrder } from '../../test/mocks/mockOrder'
import HmppsAuditClient from '../data/hmppsAuditClient'
import RestClient from '../data/restClient'
import { Order, OrderStatusEnum, OrderTypeEnum } from '../models/Order'
import { SanitisedError } from '../sanitisedError'
import AuditService from '../services/auditService'
import OrderSearchService from '../services/orderSearchService'
import OrderSearchController from './orderSearchController'
import { createMockRequest, createMockResponse } from '../../test/mocks/mockExpress'

jest.mock('../services/auditService')
jest.mock('../services/orderSearchService')
jest.mock('../data/hmppsAuditClient')

const mockDraftOrder = getMockOrder()
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
        ceprId: null,
        ccrnId: null,
        firstName: 'first',
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
    it('should render a view containing users orders', async () => {
      mockOrderService.listOrders.mockResolvedValue([mockDraftOrder, mockSubmittedOrder])

      await orderController.list(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/index',
        expect.objectContaining({
          orders: [
            {
              href: `/order/${mockDraftOrder.id}/summary`,
              index: 0,
              name: 'Not supplied',
              statusTags: [{ type: 'DRAFT', text: 'Draft' }],
            },
            {
              href: `/order/${mockSubmittedOrder.id}/summary`,
              index: 1,
              name: 'first last',
              statusTags: [
                { type: 'VARIATION', text: 'Change to form' },
                { type: 'SUBMITTED', text: 'Submitted' },
              ],
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
              pins: ['some id number'],
              location: 'Glossop',
              startDate: '20/11/2000',
              endDate: '20/11/2000',
              lastUpdated: '20/11/2000',
            },
          ],
        }),
      )
    })

    it('should render all id numbers', async () => {
      mockSubmittedOrder.deviceWearer.nomisId = 'nomisId'
      mockSubmittedOrder.deviceWearer.pncId = 'pncId'
      mockSubmittedOrder.deviceWearer.deliusId = 'deliusId'
      mockSubmittedOrder.deviceWearer.ceprId = 'ceprId'
      mockSubmittedOrder.deviceWearer.ccrnId = 'ccrnId'
      mockSubmittedOrder.deviceWearer.prisonNumber = 'prisNum'
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
              pins: ['nomisId', 'pncId', 'deliusId', 'ceprId', 'ccrnId', 'prisNum'],
              location: 'Glossop',
              startDate: '20/11/2000',
              endDate: '20/11/2000',
              lastUpdated: '20/11/2000',
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
