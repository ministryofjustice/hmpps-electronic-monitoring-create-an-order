import ReturnReasonsController from './controller'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'

describe('ReturnReasonsController', () => {
  it('renders return reasons for the current order', async () => {
    const controller = new ReturnReasonsController()
    const order = getMockOrder()
    const req = createMockRequest({ order })
    const res = createMockResponse(order)

    await controller.view(req, res, jest.fn())

    expect(res.render).toHaveBeenCalledWith(
      'pages/order/return-reasons',
      expect.objectContaining({ pageTitle: 'EMS gave these reasons for returning this form' }),
    )
  })

  it('returns to the order summary', async () => {
    const controller = new ReturnReasonsController()
    const order = getMockOrder()
    const req = createMockRequest({ order, body: { action: 'returnToSummary' } })
    const res = createMockResponse(order)
    res.locals.orderSummaryUri = `/order/${order.id}/summary`

    await controller.update(req, res, jest.fn())

    expect(res.redirect).toHaveBeenCalledWith(res.locals.orderSummaryUri)
  })
})
