import type { Express } from 'express'
import request from 'supertest'
import * as cheerio from 'cheerio'
import { v4 as uuidv4 } from 'uuid'
import { createAcceptanceApp } from './testutils/acceptanceApp'
import FakeCemoApiClient from './testutils/fakeCemoApiClient'
import { getRadioOptionLabels } from './testutils/radioOptions'
import OrderService from '../services/orderService'
import IsRejectionService from '../routes/is-rejection/service'
import FeatureFlags from '../utils/featureFlags'
import mockApiOrder from '../../integration_tests/utils/data/ApiOrder'

// eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
jest.mock('../utils/featureFlags', () => require('./testutils/fakeFeatureFlags').mockFeatureFlags())

const orderId = uuidv4()
const orderPath = `/api/orders/${orderId}`
const pagePath = `/order/${orderId}/is-rejection`

const daysFromNow = (days: number): string =>
  new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * days).setHours(0, 0, 0, 0)).toISOString()

const stubOrder = (api: FakeCemoApiClient, startDate: string | null = null): void => {
  api.stubResponse('GET', orderPath, {
    ...mockApiOrder('SUBMITTED'),
    id: orderId,
    monitoringConditions: { ...mockApiOrder().monitoringConditions, startDate },
  })
}

describe('Recording whether an order edit is because the original was rejected', () => {
  let api: FakeCemoApiClient
  let app: Express

  beforeEach(async () => {
    api = new FakeCemoApiClient()
    app = createAcceptanceApp({
      orderService: new OrderService(api),
      isRejectionService: new IsRejectionService(api),
    })

    await FeatureFlags.getInstance().setFlag('SERVICE_REQUEST_TYPE_ENABLED', false)
  })

  it('offers the user a yes/no choice', async () => {
    stubOrder(api)

    const response = await request(app).get(pagePath)

    expect(response.status).toBe(200)

    const $ = cheerio.load(response.text)
    const options = getRadioOptionLabels($, 'answer')

    expect(options).toEqual(['Yes', 'No'])
  })

  it('shows the user an error when no answer is given', async () => {
    stubOrder(api)

    const submission = await request(app).post(pagePath).type('form').send({ action: 'continue' })

    expect(submission.status).toBe(302)
    expect(submission.headers.location).toBe(pagePath)
  })

  it('returns the user to the order summary when the cancel button is used', async () => {
    stubOrder(api)

    const response = await request(app).post(pagePath).type('form').send({ action: 'back' })

    expect(response.headers.location).toBe(`/order/${orderId}/summary`)
  })

  it('amends the original order when the answer is "Yes"', async () => {
    stubOrder(api)
    api.stubResponse('POST', `${orderPath}/amend-rejected-order`, {})

    const response = await request(app).post(pagePath).type('form').send({ action: 'continue', answer: 'yes' })

    expect(api.requestsTo('POST', `${orderPath}/amend-rejected-order`)).toHaveLength(1)
    expect(response.headers.location).toBe(`/order/${orderId}/interest-parties/notifying-organisation`)
  })

  it('creates a variation of the order when the answer is "No"', async () => {
    // The default (SERVICE_REQUEST_TYPE_ENABLED disabled) behaviour always
    // copies the order as a variation, regardless of the monitoring
    // condition start date.
    stubOrder(api, daysFromNow(-45))
    api.stubResponse('POST', `${orderPath}/copy-as-variation`, {})

    const response = await request(app).post(pagePath).type('form').send({ action: 'continue', answer: 'no' })

    expect(api.requestsTo('POST', `${orderPath}/copy-as-variation`)).toHaveLength(1)
    expect(response.headers.location).toBe(`/order/${orderId}/interest-parties/notifying-organisation`)
  })

  describe('with SERVICE_REQUEST_TYPE_ENABLED enabled', () => {
    beforeEach(async () => {
      await FeatureFlags.getInstance().setFlag('SERVICE_REQUEST_TYPE_ENABLED', true)
    })

    it('creates a variation when the answer is "No" and the start date is less than 30 days away', async () => {
      stubOrder(api, daysFromNow(15))
      api.stubResponse('POST', `${orderPath}/copy-as-variation`, {})

      const response = await request(app).post(pagePath).type('form').send({ action: 'continue', answer: 'no' })

      expect(api.requestsTo('POST', `${orderPath}/copy-as-variation`)).toHaveLength(1)
      expect(response.headers.location).toBe(`/order/${orderId}/interest-parties/notifying-organisation`)
    })

    it('goes to the is-address-change page when the answer is "No" and the start date has passed', async () => {
      stubOrder(api, daysFromNow(-15))

      const response = await request(app).post(pagePath).type('form').send({ action: 'continue', answer: 'no' })

      expect(response.headers.location).toBe(`/order/${orderId}/is-address-change`)
    })
  })
})
