import { getMockOrder } from '../../../test/mocks/mockOrder'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import SentencingActService from './SentencingActService'
import SentencingActSelection from './controller'

describe('SentencingActSelection', () => {
  const sentencingActService = {
    setSentencingActFlag: jest.fn(),
  } as unknown as jest.Mocked<SentencingActService>
  const controller = new SentencingActSelection(sentencingActService)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('redirects a variation from the page without changing its inherited rules', async () => {
    const order = getMockOrder({ type: 'VARIATION' })
    const req = createMockRequest({ order, params: { orderId: order.id } })
    const res = createMockResponse()

    await controller.view(req, res, jest.fn())

    expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/summary`)
  })

  it('does not change a variation flag when the page is submitted directly', async () => {
    const order = getMockOrder({ type: 'VARIATION', isSentencingAct: false })
    const req = createMockRequest({ order, params: { orderId: order.id }, body: { answer: 'yes' } })
    const res = createMockResponse()

    await controller.update(req, res, jest.fn())

    expect(sentencingActService.setSentencingActFlag).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/summary`)
  })
})
