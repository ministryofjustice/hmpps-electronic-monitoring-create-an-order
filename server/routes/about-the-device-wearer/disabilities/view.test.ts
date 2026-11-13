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

  it('uses the question as the only H1 and does not ask for an unlisted condition description', async () => {
    const order = getMockOrder()
    order.deviceWearer.disabilities = ['OTHER']
    order.deviceWearer.otherDisability = 'Broken arm'

    const res = await renderPage(order)

    expect(res.text.match(/<h1\b/g)).toHaveLength(1)
    expect(res.text).toMatch(
      /<h1[^>]*>\s*Does the device wearer have any of the disabilities or health conditions listed\?\s*<\/h1>/,
    )
    expect(res.text).toContain(
      'Provide disability or health conditions information to help plan installation. Answer questions based on what you know about the device wearer&#39;s access needs and requirements.',
    )
    expect(res.text).toContain('Select all that apply')
    expect(res.text).toMatch(/<input[^>]*name="disabilities"[^>]*value="OTHER"[^>]*checked/)
    expect(res.text).not.toContain('name="otherDisability"')
    expect(res.text).not.toContain('data-aria-controls')
    expect(res.text).not.toContain('value="PREFER_NOT_TO_SAY"')
    expect(res.text).toMatch(/<button[^>]*value="continue"[^>]*>\s*Continue\s*<\/button>/)
    expect(res.text).not.toContain('Save and continue')
    expect(res.text).not.toContain('Save as draft')
  })

  it.each(['DDV4', 'DDV5'] as const)(
    'shows the option hints for %s without visual or hearing hints',
    async dataDictionaryVersion => {
      const res = await renderPage(getMockOrder({ dataDictionaryVersion }))
      const hints = [
        ['MOBILITY', 'For example, impaired use of arms or legs, use of a wheelchair or crutches'],
        ['DEXTERITY', 'For example, dyspraxia or neurological conditions such as Parkinson&#39;s disease'],
        [
          'LEARNING_UNDERSTANDING_CONCENTRATING',
          'For example, dyslexia or attention deficit hyperactivity disorder (ADHD)',
        ],
        ['MEMORY', 'For example, Dementia, Alzheimer&#39;s disease or amnesia'],
        ['MENTAL_HEALTH', 'For example, depression, psychosis, schizophrenia or any anxiety disorder'],
        [
          'STAMINA_BREATHING_FATIGUE',
          'For example, Heart conditions or lung conditions such as chronic obstructive pulmonary disease (COPD)',
        ],
        ['SOCIAL_BEHAVIOURAL', 'For example, Autism Spectrum Disorder (ASD)'],
        ...(dataDictionaryVersion === 'DDV5'
          ? [['SKIN_CONDITION', 'For example, acne, eczema, psoriasis, or skin infections']]
          : []),
      ]

      hints.forEach(([value, hint]) => {
        expect(res.text).toContain(hint)
        expect(res.text.match(new RegExp(`<input[^>]*value="${value}"[^>]*>`))?.[0]).toContain('aria-describedby=')
      })
      const optionsWithoutHints = ['VISION', 'HEARING']
      optionsWithoutHints.forEach(value => {
        expect(res.text.match(new RegExp(`<input[^>]*value="${value}"[^>]*>`))?.[0]).not.toContain('aria-describedby=')
      })
    },
  )

  it('marks only the last two checkboxes as exclusive', async () => {
    const res = await renderPage(getMockOrder())

    expect(res.text).toMatch(/<input[^>]*value="NO_LISTED_CONDITION"[^>]*data-behaviour="exclusive"/)
    expect(res.text).toMatch(/<input[^>]*value="NONE"[^>]*data-behaviour="exclusive"/)
    expect(res.text.match(/data-behaviour="exclusive"/g)).toHaveLength(2)
  })

  it('preserves the submitted checkboxes alongside an error', async () => {
    flashProvider.mockImplementation((key: string) => {
      if (key === 'validationErrors') return [{ field: 'disabilities', error: requiredError }]
      if (key === 'formData') return [{ disabilities: ['OTHER', 'MEMORY'], otherDisability: '' }]
      return []
    })

    const res = await renderPage(getMockOrder())

    expect(res.text).toContain(`href="#disabilities">${requiredError}</a>`)
    expect(res.text).toMatch(/<input[^>]*value="OTHER"[^>]*checked/)
    expect(res.text).toMatch(/<input[^>]*value="MEMORY"[^>]*checked/)
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
    order.deviceWearer.disabilities = ['HEARING', 'OTHER']
    order.deviceWearer.otherDisability = 'Broken arm'

    const res = await renderPage(order)

    expect(res.text).toMatch(/<input[^>]*value="HEARING"[^>]*checked[^>]*disabled/)
    expect(res.text).toMatch(/<input[^>]*value="OTHER"[^>]*checked[^>]*disabled/)
    expect(res.text).not.toContain('name="otherDisability"')
    expect(res.text).not.toContain('Save as draft')
  })
})
