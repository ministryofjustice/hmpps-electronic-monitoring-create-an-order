import type { Express } from 'express'
import request from 'supertest'
import * as cheerio from 'cheerio'
import { v4 as uuidv4 } from 'uuid'
import { createAcceptanceApp } from '../testutils/acceptanceApp'
import FakeCemoApiClient from '../testutils/fakeCemoApiClient'
import { getRadioOptionLabels, getSelectedRadioLabel } from '../testutils/radioOptions'
import expectValidationError from '../testutils/assertValidationError'
import OrderService from '../../services/orderService'
import DeviceWearerService from '../../services/deviceWearerService'
import TaskListService from '../../services/taskListService'
import mockApiOrder from '../../../integration_tests/utils/data/ApiOrder'

// eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
jest.mock('../../utils/featureFlags', () => require('../testutils/fakeFeatureFlags').mockFeatureFlags())

const orderId = uuidv4()
const orderPath = `/api/orders/${orderId}`
const deviceWearerPath = `/api/orders/${orderId}/device-wearer/no-fixed-abode`
const pagePath = `/order/${orderId}/contact-information/no-fixed-abode`

describe('Recording whether the device wearer has a fixed address', () => {
  let api: FakeCemoApiClient
  let app: Express

  beforeEach(() => {
    api = new FakeCemoApiClient()
    app = createAcceptanceApp({
      orderService: new OrderService(api),
      deviceWearerService: new DeviceWearerService(api),
      taskListService: new TaskListService(),
    })

    api.stubResponse('GET', orderPath, { ...mockApiOrder(), id: orderId })
  })

  it('offers the user a yes/no choice', async () => {
    const response = await request(app).get(pagePath)

    expect(response.status).toBe(200)

    const $ = cheerio.load(response.text)
    const options = getRadioOptionLabels($, 'noFixedAbode')

    expect(options).toEqual(['Yes', 'No'])
    expect($('.govuk-error-summary')).toHaveLength(0)
  })

  it('shows the previously saved answer when the user returns to the page', async () => {
    const order = mockApiOrder()
    api.stubResponse('GET', orderPath, {
      ...order,
      id: orderId,
      deviceWearer: { ...order.deviceWearer, noFixedAbode: true },
    })

    const response = await request(app).get(pagePath)

    const $ = cheerio.load(response.text)

    expect(getSelectedRadioLabel($, 'noFixedAbode')).toBe('No')
  })

  it('tells the API the device wearer has no fixed address when the user answers "No"', async () => {
    api.stubResponse('PUT', deviceWearerPath, { ...mockApiOrder().deviceWearer, noFixedAbode: true })

    const response = await request(app).post(pagePath).type('form').send({ action: 'continue', noFixedAbode: 'true' })

    expect(response.status).toBe(302)
    expect(api.requestsTo('PUT', deviceWearerPath).map(({ body }) => body)).toEqual([{ noFixedAbode: true }])
  })

  it('shows the user the error when the API rejects an unanswered form', async () => {
    const expectedMessage = 'You must indicate whether the device wearer has a fixed abode'
    api.stubFailure('PUT', deviceWearerPath, 400, [{ field: 'noFixedAbode', error: expectedMessage }])

    await expectValidationError(app, pagePath, { action: 'continue' }, expectedMessage)
  })

  it('goes on to collect an address when the device wearer has a fixed address', async () => {
    api.stubResponse('PUT', deviceWearerPath, { ...mockApiOrder().deviceWearer, noFixedAbode: false })

    const response = await request(app).post(pagePath).type('form').send({ action: 'continue', noFixedAbode: 'false' })

    expect(response.headers.location).toBe(`/order/${orderId}/find-address/PRIMARY`)
  })

  it('returns the user to the order summary when they save as draft', async () => {
    api.stubResponse('PUT', deviceWearerPath, { ...mockApiOrder().deviceWearer, noFixedAbode: false })

    const response = await request(app).post(pagePath).type('form').send({ action: 'back', noFixedAbode: 'false' })

    expect(response.headers.location).toBe(`/order/${orderId}/summary`)
  })
})
