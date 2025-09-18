import type { NextFunction, Request, Response } from 'express'
import RestClient from '../../../data/restClient'
import OrderTypeController from './controller'
import OrderTypeService from './service'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'

jest.mock('./service')
jest.mock('../../../data/restClient')

describe('order type controller', () => {
  const mockRestClient = new RestClient('cemoApi', {
    url: '',
    timeout: { response: 0, deadline: 0 },
    agent: { timeout: 0 },
  }) as jest.Mocked<RestClient>
  let mockOrderTypeService: jest.Mocked<OrderTypeService>
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    mockOrderTypeService = new OrderTypeService(mockRestClient) as jest.Mocked<OrderTypeService>

    req = createMockRequest()
    res = createMockResponse()
    next = jest.fn()
  })

  it('should render the correct view', () => {
    const controller = new OrderTypeController(mockOrderTypeService)

    controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/order-type-description/order-type')
  })
})
