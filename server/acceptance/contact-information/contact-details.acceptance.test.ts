import type { Express } from 'express'
import request from 'supertest'
import * as cheerio from 'cheerio'
import { v4 as uuidv4 } from 'uuid'
import { createAcceptanceApp } from '../testutils/acceptanceApp'
import FakeCemoApiClient from '../testutils/fakeCemoApiClient'
import OrderService from '../../services/orderService'
import ContactDetailsService from '../../services/contactDetailsService'
import TaskListService from '../../services/taskListService'
import mockApiOrder from '../../../integration_tests/utils/data/ApiOrder'

// eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
jest.mock('../../utils/featureFlags', () => require('../testutils/fakeFeatureFlags').mockFeatureFlags())

const orderId = uuidv4()
const orderPath = `/api/orders/${orderId}`
const contactDetailsPath = `/api/orders/${orderId}/contact-details`
const pagePath = `/order/${orderId}/contact-information/contact-details`

describe('Recording the device wearer contact details', () => {
  let api: FakeCemoApiClient
  let app: Express

  beforeEach(() => {
    api = new FakeCemoApiClient()
    app = createAcceptanceApp({
      orderService: new OrderService(api),
      contactDetailsService: new ContactDetailsService(api),
      taskListService: new TaskListService(),
    })

    api.stubResponse('GET', orderPath, { ...mockApiOrder(), id: orderId })
  })

  it('offers a yes/no choice and a contact number field', async () => {
    const response = await request(app).get(pagePath)

    expect(response.status).toBe(200)

    const $ = cheerio.load(response.text)

    expect($('input[name="phoneNumberAvailable"]')).toHaveLength(2)
    expect($('#contactNumber')).toHaveLength(1)
    expect($('.govuk-error-summary')).toHaveLength(0)
  })

  it('shows the previously saved answer when the user returns to the page', async () => {
    const order = mockApiOrder()
    api.stubResponse('GET', orderPath, {
      ...order,
      id: orderId,
      contactDetails: { contactNumber: '01234567890', phoneNumberAvailable: true },
    })

    const response = await request(app).get(pagePath)

    const $ = cheerio.load(response.text)

    expect($('input[name="phoneNumberAvailable"]:checked').attr('value')).toBe('true')
    expect($('#contactNumber').attr('value')).toBe('01234567890')
  })

  it('submits the contact details to the API when the user answers "Yes"', async () => {
    api.stubResponse('PUT', contactDetailsPath, { contactNumber: '01234567890', phoneNumberAvailable: true })

    const response = await request(app)
      .post(pagePath)
      .type('form')
      .send({ action: 'continue', phoneNumberAvailable: 'true', contactNumber: '01234567890' })

    expect(response.status).toBe(302)
    expect(api.requestsTo('PUT', contactDetailsPath).map(({ body }) => body)).toEqual([
      { phoneNumberAvailable: 'true', contactNumber: '01234567890' },
    ])
  })

  it('goes on to collect no fixed abode details', async () => {
    api.stubResponse('PUT', contactDetailsPath, { contactNumber: '01234567890', phoneNumberAvailable: true })

    const response = await request(app)
      .post(pagePath)
      .type('form')
      .send({ action: 'continue', phoneNumberAvailable: 'true', contactNumber: '01234567890' })

    expect(response.headers.location).toBe(`/order/${orderId}/contact-information/no-fixed-abode`)
  })

  it('returns the user to the order summary when they save as draft', async () => {
    api.stubResponse('PUT', contactDetailsPath, { contactNumber: '01234567890', phoneNumberAvailable: true })

    const response = await request(app)
      .post(pagePath)
      .type('form')
      .send({ action: 'back', phoneNumberAvailable: 'true', contactNumber: '01234567890' })

    expect(response.headers.location).toBe(`/order/${orderId}/summary`)
  })

  it('shows the user an error when no answer is given', async () => {
    const expectedMessage = 'Select Yes if the device wearer has a contact telephone number'

    const browser = request.agent(app)

    const submission = await browser.post(pagePath).type('form').send({ action: 'continue' })

    expect(submission.status).toBe(302)
    expect(submission.headers.location).toBe(pagePath)

    const redisplayed = await browser.get(pagePath)
    const $ = cheerio.load(redisplayed.text)

    expect($('.govuk-error-summary').text()).toContain(expectedMessage)
    expect($('.govuk-error-message').text()).toContain(expectedMessage)
  })

  it('shows the user an error when "Yes" is answered without a contact number', async () => {
    const expectedMessage = 'Enter the device wearer’s telephone number'

    const browser = request.agent(app)

    const submission = await browser
      .post(pagePath)
      .type('form')
      .send({ action: 'continue', phoneNumberAvailable: 'true' })

    expect(submission.status).toBe(302)
    expect(submission.headers.location).toBe(pagePath)

    const redisplayed = await browser.get(pagePath)
    const $ = cheerio.load(redisplayed.text)

    expect($('.govuk-error-summary').text()).toContain(expectedMessage)
    expect($('.govuk-error-message').text()).toContain(expectedMessage)
  })
})
