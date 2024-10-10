import type { NextFunction, Request, Response } from 'express'
import { getMockOrder } from '../../test/mocks/mockOrder'
import HmppsAuditClient from '../data/hmppsAuditClient'
import RestClient from '../data/restClient'
import { Order, OrderStatusEnum } from '../models/Order'
import { SanitisedError } from '../sanitisedError'
import AuditService from '../services/auditService'
import OrderSearchService from '../services/orderSearchService'
import OrderSearchController from './orderSearchController'

jest.mock('../services/auditService')
jest.mock('../services/orderSearchService')
jest.mock('../data/hmppsAuditClient')

const mockDraftOrder = getMockOrder()

const mockSubmittedOrder: Order = {
  ...getMockOrder({ status: OrderStatusEnum.Enum.SUBMITTED }),
  deviceWearer: {
    nomisId: null,
    pncId: null,
    deliusId: null,
    prisonNumber: null,
    firstName: 'first',
    lastName: 'last',
    alias: null,
    dateOfBirth: null,
    adultAtTimeOfInstallation: false,
    sex: null,
    gender: null,
    disabilities: [],
  },
}

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

    req = {
      // @ts-expect-error stubbing session
      session: {},
      query: {},
      params: {
        orderId: '123456789',
      },
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
      },
      redirect: jest.fn(),
      render: jest.fn(),
      set: jest.fn(),
      send: jest.fn(),
    }

    next = jest.fn()
  })

  describe('search orders', () => {
    it('should render a view containing order search results', async () => {
      mockOrderService.searchOrders.mockResolvedValue([mockDraftOrder, mockSubmittedOrder])

      await orderController.search(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/index',
        expect.objectContaining({
          orders: [
            { displayName: 'New form', status: 'IN_PROGRESS', summaryUri: `/order/${mockDraftOrder.id}/summary` },
            { displayName: 'first last', status: 'SUBMITTED', summaryUri: `/order/${mockSubmittedOrder.id}/summary` },
          ],
        }),
      )
    })

    it('should render a view containing no results if there is an error', async () => {
      mockOrderService.searchOrders.mockRejectedValue(mock500Error)

      await orderController.search(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/index',
        expect.objectContaining({
          orders: [],
        }),
      )
    })
  })
})
