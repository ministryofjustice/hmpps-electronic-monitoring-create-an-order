import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getMockOrder } from '../../test/mocks/mockOrder'
import RestClient from '../data/restClient'
import { OrderStatusEnum } from '../models/Order'
import { SanitisedError } from '../sanitisedError'
import OrderService from '../services/orderService'
import populateCurrentOrder from './populateCurrentOrder'

jest.mock('../data/restClient')
jest.mock('../services/orderService')

const createMockRequest = (): Request => {
  return {
    // @ts-expect-error stubbing session
    session: {},
    query: {},
    params: {},
    user: {
      username: '',
      token: '',
      authSource: '',
    },
  }
}

const createMockResponse = (): Response => {
  // @ts-expect-error stubbing res.render
  return {
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
}

const mockNotFoundRequest: SanitisedError = {
  message: 'Not Found',
  name: 'Not Found',
  stack: '',
  status: 404,
}

describe('populateCurrentOrder', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockOrderService: jest.Mocked<OrderService>

  beforeEach(() => {
    jest.resetAllMocks()

    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>

    mockOrderService = new OrderService(mockRestClient) as jest.Mocked<OrderService>
  })

  it('should throw an error when no order is found', async () => {
    // Given
    const req = createMockRequest()
    const res = createMockResponse()
    const next = jest.fn()
    mockOrderService.getOrder.mockRejectedValue(mockNotFoundRequest)

    // When
    await populateCurrentOrder(mockOrderService)(req, res, next, uuidv4(), 'orderId')

    // Then
    expect(next).toHaveBeenCalledWith(mockNotFoundRequest)
    expect(res.locals).not.toHaveProperty('isOrderEditable')
    expect(res.locals).not.toHaveProperty('orderId')
  })

  it('should hydrate the req/res correctly when the order is submitted', async () => {
    // Given
    const req = createMockRequest()
    const res = createMockResponse()
    const next = jest.fn()
    const mockOrder = getMockOrder({ status: OrderStatusEnum.Enum.SUBMITTED })
    mockOrderService.getOrder.mockResolvedValue(mockOrder)

    // When
    await populateCurrentOrder(mockOrderService)(req, res, next, uuidv4(), 'orderId')

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.order).toEqual(mockOrder)
    expect(res.locals.isOrderEditable).toEqual(false)
    expect(res.locals.orderId).toEqual(mockOrder.id)
    expect(res.locals.content).not.toBeUndefined()
  })

  it('should hydrate the req/res correctly when the order is a draft', async () => {
    // Given
    const req = createMockRequest()
    const res = createMockResponse()
    const next = jest.fn()
    const mockOrder = getMockOrder({ status: OrderStatusEnum.Enum.IN_PROGRESS })
    mockOrderService.getOrder.mockResolvedValue(mockOrder)

    // When
    await populateCurrentOrder(mockOrderService)(req, res, next, uuidv4(), 'orderId')

    // Then
    expect(next).toHaveBeenCalled()
    expect(req.order).toEqual(mockOrder)
    expect(res.locals.isOrderEditable).toEqual(true)
    expect(res.locals.orderId).toEqual(mockOrder.id)
    expect(res.locals.content).not.toBeUndefined()
  })
})
