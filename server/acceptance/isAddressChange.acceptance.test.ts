import type { Express } from 'express'
import request from 'supertest'
import * as cheerio from 'cheerio'
import { v4 as uuidv4 } from 'uuid'
import { createAcceptanceApp } from './testutils/acceptanceApp'
import FakeCemoApiClient from './testutils/fakeCemoApiClient'
import OrderService from '../services/orderService'
import ServiceRequestTypeService from '../routes/variations/serviceRequestTypeService'
import mockApiOrder from '../../integration_tests/utils/data/ApiOrder'

const orderId = uuidv4()
const orderPath = `/api/orders/${orderId}`
const pagePath = `/order/${orderId}/is-address-change`

describe('Recording whether the device wearer address has changed', () => {
  let api: FakeCemoApiClient
  let app: Express

  beforeEach(() => {
    api = new FakeCemoApiClient()
    app = createAcceptanceApp({
      orderService: new OrderService(api),
      serviceRequestTypeService: new ServiceRequestTypeService(api),
    })

    api.stubResponse('GET', orderPath, { ...mockApiOrder('SUBMITTED'), id: orderId })
  })

  it('offers the user a yes/no choice', async () => {
    const response = await request(app).get(pagePath)

    expect(response.status).toBe(200)

    const $ = cheerio.load(response.text)
    const options = $('input[name="answer"]')
      .map((_, input) =>
        $(`label[for="${$(input).attr('id')}"]`)
          .text()
          .trim(),
      )
      .get()

    expect(options).toEqual(['Yes', 'No'])
  })

  it('shows the user an error when no answer is given', async () => {
    const expectedMessage = 'Select Yes if the device wearer’s primary address has changed'

    const browser = request.agent(app)

    const submission = await browser.post(pagePath).type('form').send({ action: 'continue' })

    expect(submission.status).toBe(302)
    expect(submission.headers.location).toBe(pagePath)

    const redisplayed = await browser.get(pagePath)
    const $ = cheerio.load(redisplayed.text)

    expect($('.govuk-error-summary').text()).toContain(expectedMessage)
    expect($('.govuk-error-message').text()).toContain(expectedMessage)
  })

  it('returns the user to the order summary when the cancel button is used', async () => {
    const response = await request(app).post(pagePath).type('form').send({ action: 'back' })

    expect(response.headers.location).toBe(`/order/${orderId}/summary`)
  })

  it('continues to the service request type page when the answer is "No"', async () => {
    const response = await request(app).post(pagePath).type('form').send({ action: 'continue', answer: 'no' })

    expect(response.headers.location).toBe(`/order/${orderId}/service-request-type`)
  })

  it('amends the order and continues to notifying organisation when the answer is "Yes"', async () => {
    api.stubResponse('POST', `${orderPath}/amend-order`, {})

    const response = await request(app).post(pagePath).type('form').send({ action: 'continue', answer: 'yes' })

    expect(api.requestsTo('POST', `${orderPath}/amend-order`).map(({ body }) => body)).toEqual([
      { type: 'REINSTALL_DEVICE' },
    ])
    expect(response.headers.location).toBe(`/order/${orderId}/interest-parties/notifying-organisation`)
  })
})
