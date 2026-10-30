import type { Express } from 'express'
import request from 'supertest'
import { getMockOrder, getMockSubmittedOrder } from '../../../../test/mocks/mockOrder'
import HmppsAuditClient from '../../../data/hmppsAuditClient'
import RestClient from '../../../data/restClient'
import { Order } from '../../../models/Order'
import AuditService from '../../../services/auditService'
import OrderService from '../../../services/orderService'
import TaskListService from '../../../services/taskListService'
import InMemoryStore from '../../store/inMemoryStore'
import { appWithAllRoutes, flashProvider } from '../../testutils/appSetup'
import DeviceWearerAnswersService from '../deviceWearerAnswersService'
import DeviceWearerStoreService from '../store/deviceWearerStoreService'

jest.mock('../../../services/auditService')
jest.mock('../../../services/orderService')
jest.mock('../../../data/hmppsAuditClient')

const requiredError = 'Select if the device wearer has any disability or health conditions'

describe('Disability and health conditions page', () => {
  const restClient = { put: jest.fn() } as unknown as RestClient
  const auditService = new AuditService({} as HmppsAuditClient) as jest.Mocked<AuditService>
  const orderService = new OrderService(restClient) as jest.Mocked<OrderService>
  let app: Express

  const renderPage = async (order: Order) => {
    orderService.getOrder.mockResolvedValue(order)
    return request(app).get(`/order/${order.id}/about-the-device-wearer/disabilities`).expect(200)
  }

  beforeEach(() => {
    flashProvider.mockReturnValue([])
    app = appWithAllRoutes({
      services: {
        auditService,
        orderService,
        taskListService: new TaskListService(),
        deviceWearerAnswersService: new DeviceWearerAnswersService(
          new DeviceWearerStoreService(new InMemoryStore()),
          restClient,
        ),
      },
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('shows the disabilities question without an input for an unlisted condition', async () => {
    const order = getMockOrder()
    order.deviceWearer.disabilities = ['OTHER']

    const res = await renderPage(order)

    expect(res.text).toContain('Disability and health conditions')
    expect(res.text).toContain('Does the device wearer have any of the disabilities or health conditions listed?')
    expect(res.text).toMatch(/<input[^>]*name="disabilities"[^>]*value="OTHER"[^>]*checked/)
    expect(res.text).not.toContain('name="otherDisability"')
    expect(res.text).not.toContain('data-aria-controls')
    expect(res.text).not.toContain('value="PREFER_NOT_TO_SAY"')
    expect(res.text).toMatch(/<button[^>]*value="continue"[^>]*>\s*Continue\s*<\/button>/)
    expect(res.text).not.toContain('Save and continue')
    expect(res.text).not.toContain('Save as draft')
  })

  it('shows a validation error linked to the question', async () => {
    flashProvider.mockImplementation((key: string) =>
      key === 'validationErrors' ? [{ field: 'disabilities', error: requiredError }] : [],
    )

    const res = await renderPage(getMockOrder())

    expect(res.text).toContain('There is a problem')
    expect(res.text).toContain(`href="#disabilities">${requiredError}</a>`)
    expect(res.text).toMatch(/id="disabilities"[^>]*name="disabilities"/)
    expect(res.text).toContain('id="disabilities-error"')
  })

  it('is read only for a submitted order', async () => {
    const order = getMockSubmittedOrder()
    order.deviceWearer.disabilities = ['HEARING']

    const res = await renderPage(order)

    expect(res.text).toMatch(/<input[^>]*value="HEARING"[^>]*checked[^>]*disabled/)
    expect(res.text).not.toContain('Save as draft')
  })
})
