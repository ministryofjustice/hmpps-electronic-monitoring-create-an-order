// The MAPPA journey is gated behind the OFFENCE_FLOW_ENABLED feature flag
// (see TaskListService). FeatureFlags is mocked below with this flag forced
// on, scoped to this test file only.
import type { Express } from 'express'
import request from 'supertest'
import * as cheerio from 'cheerio'
import { v4 as uuidv4 } from 'uuid'
import { createAcceptanceApp } from '../testutils/acceptanceApp'
import FakeCemoApiClient from '../testutils/fakeCemoApiClient'
import { getRadioOptionLabels, getSelectedRadioLabel } from '../testutils/radioOptions'
import expectValidationError from '../testutils/assertValidationError'
import OrderService from '../../services/orderService'
import MappaService from '../../routes/installation-and-risk/mappa/service'
import TaskListService from '../../services/taskListService'
import mockApiOrder from '../../../integration_tests/utils/data/ApiOrder'

jest.mock('../../utils/featureFlags', () =>
  // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
  require('../testutils/fakeFeatureFlags').mockFeatureFlags({ OFFENCE_FLOW_ENABLED: true }),
)

const orderId = uuidv4()
const orderPath = `/api/orders/${orderId}`
const isMappaPath = `/api/orders/${orderId}/mappa/is-mappa`
const pagePath = `/order/${orderId}/installation-and-risk/is-mappa`

// IS_MAPPA is only offered when the notifying organisation is the Home
// Office, matching TaskListService's task gating.
const homeOfficeOrder = {
  ...mockApiOrder(),
  id: orderId,
  interestedParties: {
    notifyingOrganisation: 'HOME_OFFICE',
    notifyingOrganisationName: '',
    notifyingOrganisationEmail: '',
    responsibleOfficerName: '',
    responsibleOfficerPhoneNumber: '',
    responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
    responsibleOrganisationEmail: '',
    responsibleOrganisationRegion: '',
  },
}

describe('Recording whether the device wearer is a MAPPA offender', () => {
  let api: FakeCemoApiClient
  let app: Express

  beforeEach(() => {
    api = new FakeCemoApiClient()
    app = createAcceptanceApp({
      orderService: new OrderService(api),
      mappaService: new MappaService(api),
      taskListService: new TaskListService(),
    })

    api.stubResponse('GET', orderPath, homeOfficeOrder)
  })

  it('offers the user a yes/no/unknown choice', async () => {
    const response = await request(app).get(pagePath)

    expect(response.status).toBe(200)

    const $ = cheerio.load(response.text)
    const options = getRadioOptionLabels($, 'isMappa')

    expect(options.length).toBeGreaterThanOrEqual(2)
    expect($('.govuk-error-summary')).toHaveLength(0)
  })

  it('shows the previously saved answer when the user returns to the page', async () => {
    api.stubResponse('GET', orderPath, {
      ...homeOfficeOrder,
      mappa: { level: null, category: null, isMappa: 'YES' },
    })

    const response = await request(app).get(pagePath)

    const $ = cheerio.load(response.text)

    expect(getSelectedRadioLabel($, 'isMappa')).toBe('Yes')
  })

  it('goes on to collect MAPPA details when the answer is "Yes"', async () => {
    api.stubResponse('PUT', isMappaPath, { isMappa: 'YES' })

    const response = await request(app).post(pagePath).type('form').send({ action: 'continue', isMappa: 'YES' })

    expect(response.status).toBe(302)
    expect(api.requestsTo('PUT', isMappaPath).map(({ body }) => body)).toEqual([{ isMappa: 'YES' }])
    expect(response.headers.location).toBe(`/order/${orderId}/installation-and-risk/mappa`)
  })

  it('goes on to the check your answers page when the answer is "No"', async () => {
    api.stubResponse('PUT', isMappaPath, { isMappa: 'NO' })

    const response = await request(app).post(pagePath).type('form').send({ action: 'continue', isMappa: 'NO' })

    expect(response.headers.location).toBe(`/order/${orderId}/installation-and-risk/check-your-answers`)
  })

  it('returns the user to the order summary when they save as draft', async () => {
    api.stubResponse('PUT', isMappaPath, { isMappa: 'NO' })

    const response = await request(app).post(pagePath).type('form').send({ action: 'back', isMappa: 'NO' })

    expect(response.headers.location).toBe(`/order/${orderId}/summary`)
  })

  it('shows the user the error when the API rejects an unanswered form', async () => {
    const expectedMessage = 'Select Yes if the device wearer is a MAPPA offender'
    api.stubFailure('PUT', isMappaPath, 400, [{ field: 'isMappa', error: expectedMessage }])

    await expectValidationError(app, pagePath, { action: 'continue' }, expectedMessage)
  })
})
