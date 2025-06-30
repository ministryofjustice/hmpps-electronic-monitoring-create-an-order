import type { NextFunction, Request, Response } from 'express'
import { getMockOrder } from '../../test/mocks/mockOrder'
import HmppsAuditClient from '../data/hmppsAuditClient'
import RestClient from '../data/restClient'
import { OrderStatusEnum, OrderTypeEnum } from '../models/Order'
import { SanitisedError } from '../sanitisedError'
import AuditService from '../services/auditService'
import OrderSearchService from '../services/orderSearchService'
import OrderSearchController from './orderSearchController'
import { createMockRequest, createMockResponse } from '../../test/mocks/mockExpress'

jest.mock('../services/auditService')
jest.mock('../services/orderSearchService')
jest.mock('../data/hmppsAuditClient')

const mockDraftOrder = getMockOrder()

const mockSubmittedOrder = getMockOrder({
  status: OrderStatusEnum.Enum.SUBMITTED,
  type: OrderTypeEnum.Enum.VARIATION,
  deviceWearer: {
    nomisId: null,
    pncId: null,
    deliusId: null,
    prisonNumber: null,
    homeOfficeReferenceNumber: null,
    firstName: 'first',
    lastName: 'last',
    alias: null,
    dateOfBirth: null,
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
})

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

  beforeEach(() => {
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
    it('should render a view containing order search results', async () => {
      mockOrderService.searchOrders.mockResolvedValue([mockDraftOrder, mockSubmittedOrder])

      await orderController.list(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/index',
        expect.objectContaining({
          orders: [
            {
              displayName: 'New form',
              status: 'IN_PROGRESS',
              type: 'REQUEST',
              summaryUri: `/order/${mockDraftOrder.id}/summary`,
            },
            {
              displayName: 'first last',
              status: 'SUBMITTED',
              type: 'VARIATION',
              summaryUri: `/order/${mockSubmittedOrder.id}/summary`,
            },
          ],
        }),
      )
    })

    it('should render a view containing no results if there is an error', async () => {
      mockOrderService.searchOrders.mockRejectedValue(mock500Error)

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
      req.body = { searchTerm: 'firstName' }

      await orderController.search(req, res, next)

      expect(mockOrderService.searchOrders).toHaveBeenCalledWith(expect.objectContaining({ searchTerm: 'firstName' }))
    })

    it('should render a view containing search results', async () => {
      mockOrderService.searchOrders.mockResolvedValue([mockSubmittedOrder])
      req.body = { searchTerm: 'firstName' }

      await orderController.search(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/search',
        expect.objectContaining({
          orders: [
            {
              displayName: 'first last',
              status: 'SUBMITTED',
              summaryUri: `/order/${mockSubmittedOrder.id}/summary`,
              type: 'VARIATION',
            },
          ],
        }),
      )
    })

    it('should render a view when there are no results', async () => {
      mockOrderService.searchOrders.mockResolvedValue([])
      req.body = { searchTerm: 'firstName' }

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
      req.body = { searchTerm: '' }

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
      req.body = {}

      await orderController.search(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/search', {
        orders: [],
        variationsEnabled: true,
      })
    })
  })
})
