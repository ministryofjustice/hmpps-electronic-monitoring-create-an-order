import type { Express } from 'express'
import request from 'supertest'
import * as cheerio from 'cheerio'
import { v4 as uuidv4 } from 'uuid'
import { createAcceptanceApp } from '../testutils/acceptanceApp'
import FakeCemoApiClient from '../testutils/fakeCemoApiClient'
import OrderService from '../../services/orderService'
import ProbationDeliveryUnitService from '../../services/probationDeliveryUnitService'
import TaskListService from '../../services/taskListService'
import mockApiOrder from '../../../integration_tests/utils/data/ApiOrder'

// eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
jest.mock('../../utils/featureFlags', () => require('../testutils/fakeFeatureFlags').mockFeatureFlags())

const orderId = uuidv4()
const orderPath = `/api/orders/${orderId}`
const probationDeliveryUnitPath = `/api/orders/${orderId}/probation-delivery-unit`
const pagePath = `/order/${orderId}/contact-information/probation-delivery-unit`

const baseInterestedParties = {
  notifyingOrganisation: 'PRISON',
  notifyingOrganisationName: 'FELTHAM_YOUNG_OFFENDER_INSTITUTION',
  notifyingOrganisationEmail: 'test@test.com',
  responsibleOfficerName: 'John Smith',
  responsibleOfficerPhoneNumber: '01234567890',
  responsibleOrganisation: 'PROBATION',
  responsibleOrganisationEmail: 'test2@test.com',
}

const stubOrderForRegion = (api: FakeCemoApiClient, region: string, dataDictionaryVersion: string = 'DDV5'): void => {
  api.stubResponse('GET', orderPath, {
    ...mockApiOrder(),
    id: orderId,
    dataDictionaryVersion,
    interestedParties: { ...baseInterestedParties, responsibleOrganisationRegion: region },
  })
}

const getOptionLabels = ($: cheerio.CheerioAPI): string[] =>
  $('input[name="unit"]')
    .map((_, input) =>
      $(`label[for="${$(input).attr('id')}"]`)
        .text()
        .trim(),
    )
    .get()

// DDV5 delivery units by probation region, mirroring the previous per-region
// Cypress coverage in probation-delivery-unit.page.draft.cy.ts.
const ddv5RegionUnits: Record<string, string[]> = {
  EAST_MIDLANDS: [
    'Derby City',
    'Derbyshire',
    'East and West Lincolnshire',
    'Leicester, Leicestershire and Rutland',
    'Nottingham City',
    'Nottinghamshire',
  ],
  EAST_OF_ENGLAND: [
    'Bedfordshire',
    'Cambridgeshire',
    'Essex North',
    'Essex South',
    'Hertfordshire',
    'Norfolk',
    'Northamptonshire',
    'Suffolk',
  ],
  GREATER_MANCHESTER: [
    'Bolton',
    'Bury and Rochdale',
    'Manchester North',
    'Manchester South',
    'Oldham',
    'Salford',
    'Stockport and Trafford',
    'Tameside',
    'Wigan',
  ],
  KENT_SURREY_SUSSEX: ['East Kent', 'East Sussex', 'Surrey', 'West Kent', 'West Sussex', 'North Kent and Medway'],
  LONDON: [
    'Barking and Dagenham and Havering',
    'Brent',
    'Camden and Islington',
    'Croydon',
    'Ealing and Hillingdom', // Note: Typo in enum "Hillingdom" vs "Hillingdon"
    'Enfield and Haringey',
    'Greenwich and Bexley',
    'Hackney and City',
    'Hammersmith, Fulham, Kensington, Chelsea and Westminster',
    'Harrow and Barnet',
    'Kingston, Richmond and Hounslow',
    'Lambeth',
    'Lewisham and Bromley',
    'Newham',
    'Redbridge and Waltham Forest',
    'Southwark',
    'Tower Hamlets',
    'Wandsworth, Merton and Sutton',
  ],
  NORTH_EAST: [
    'County Durham and Darlington',
    'Gateshead and South Tyneside',
    'Newcastle Upon Tyne',
    'North Tyneside and Northumberland',
    'Redcar, Cleveland and Middlesbrough',
    'Stockton and Hartlepool',
    'Sunderland',
  ],
  NORTH_WEST: [
    'Blackburn',
    'Central Lancashire',
    'Cheshire East',
    'Cheshire West',
    'Cumbria',
    'East Lancashire',
    'Knowsley and St Helens',
    'Liverpool North',
    'Liverpool South',
    'North West Lancashire',
    'Sefton and Merseyside Womens',
    'Warrington and Halton',
    'Wirral and ISC Team',
  ],
  SOUTH_CENTRAL: [
    'Buckinghamshire and Milton Keynes',
    'East Berkshire',
    'Hampshire North and East',
    'Hampshire South and Isle of White', // Note: Typo in enum "White" vs "Wight"
    'Hampshire South West',
    'Oxfordshire',
    'West Berkshire',
  ],
  SOUTH_WEST: [
    'Bath and North Somerset',
    'Bristol and South Gloucestershire',
    'Cornwall and Isles of Scilly',
    'Devon and Torbay',
    'Dorset',
    'Gloucestershire',
    'Plymouth',
    'Somerset',
    'Swindon and Wiltshire',
  ],
  WALES: [
    'Cardiff and the Vale',
    'Cwm Taf Morgannwg',
    'Dyfed Powys',
    'Gwent',
    'North Wales',
    'Swansea, Neath and Port-Talbot',
  ],
  WEST_MIDLANDS: [
    'Birmingham Central and South',
    'Birmingham Courts and Centralised Functions', // Note: Typo in enum "DENTRALISED" vs "Centralised"
    'Birmingham North, East and Solihull',
    'Coventry',
    'Dudley and Sandwell',
    'Hereford, Shropshire and Telford',
    'Staffordshire and Stoke',
    'Walsall and Wolverhampton',
    'Warwickshire',
    'Worcestershire',
  ],
  YORKSHIRE_AND_THE_HUMBER: [
    'Barnsley and Rotherham',
    'Bradford and Calderdale',
    'Doncaster',
    'Hull and East Riding',
    'Kirklees',
    'Leeds',
    'North and North East Lincs',
    'North Yorkshire',
    'Sheffield',
    'Wakefield',
    'York',
  ],
}

describe('Recording the probation delivery unit', () => {
  let api: FakeCemoApiClient
  let app: Express

  beforeEach(() => {
    api = new FakeCemoApiClient()
    app = createAcceptanceApp({
      orderService: new OrderService(api),
      probationDeliveryUnitService: new ProbationDeliveryUnitService(api),
      taskListService: new TaskListService(),
    })
  })

  it('offers the user a choice, a back link and no errors', async () => {
    stubOrderForRegion(api, 'NORTH_EAST')

    const response = await request(app).get(pagePath)

    expect(response.status).toBe(200)

    const $ = cheerio.load(response.text)
    expect(getOptionLabels($)).toContain('Not able to provide this information')
    expect($('.govuk-error-summary')).toHaveLength(0)
    expect($('.govuk-back-link')).toHaveLength(1)
  })

  describe.each(Object.entries(ddv5RegionUnits))('region %s (DDV5)', (region, expectedUnits) => {
    it(`lists the delivery units for ${region}`, async () => {
      stubOrderForRegion(api, region)

      const response = await request(app).get(pagePath)
      const $ = cheerio.load(response.text)

      expect(getOptionLabels($)).toEqual(expect.arrayContaining(expectedUnits))
    })
  })

  it('lists the DDV6 delivery units, replacing renamed/merged DDV5 units', async () => {
    stubOrderForRegion(api, 'WEST_MIDLANDS', 'DDV6')

    const westMidsResponse = await request(app).get(pagePath)
    const westMids = getOptionLabels(cheerio.load(westMidsResponse.text))

    expect(westMids).not.toContain('Staffordshire and Stoke')
    expect(westMids).toEqual(
      expect.arrayContaining([
        'Staffordshire North',
        'Staffordshire South',
        'Personality Disorder Prosper (West Mids)',
      ]),
    )

    stubOrderForRegion(api, 'GREATER_MANCHESTER', 'DDV6')

    const manchesterResponse = await request(app).get(pagePath)
    const manchester = getOptionLabels(cheerio.load(manchesterResponse.text))

    expect(manchester).toEqual(expect.arrayContaining(['Stockport and Tameside', 'Salford and Trafford']))
    expect(manchester).not.toContain('Salford')
    expect(manchester).not.toContain('Stockport and Trafford')
    expect(manchester).not.toContain('Tameside')
  })

  it('lists the DDV7 delivery units for SOUTH_CENTRAL, replacing renamed/merged DDV5 units', async () => {
    stubOrderForRegion(api, 'SOUTH_CENTRAL', 'DDV7')

    const response = await request(app).get(pagePath)
    const $ = cheerio.load(response.text)

    expect(getOptionLabels($)).toEqual(
      expect.arrayContaining([
        'Buckinghamshire and Milton Keynes',
        'East Berkshire',
        'Hampshire North and East',
        'Portsmouth and Isle of Wight',
        'Southampton, Eastleigh and New Forest',
        'Oxfordshire',
        'West Berkshire',
      ]),
    )
  })

  it('shows the previously saved answer when the user returns to the page', async () => {
    api.stubResponse('GET', orderPath, {
      ...mockApiOrder(),
      id: orderId,
      dataDictionaryVersion: 'DDV5',
      interestedParties: { ...baseInterestedParties, responsibleOrganisationRegion: 'NORTH_EAST' },
      probationDeliveryUnit: { unit: 'COUNTY_DURHAM_AND_DARLINGTON' },
    })

    const response = await request(app).get(pagePath)
    const $ = cheerio.load(response.text)
    const selected = $('input[name="unit"]:checked')

    expect(
      $(`label[for="${selected.attr('id')}"]`)
        .text()
        .trim(),
    ).toBe('County Durham and Darlington')
  })

  it('returns the user to the order summary when they save as draft', async () => {
    stubOrderForRegion(api, 'NORTH_EAST')
    api.stubResponse('PUT', probationDeliveryUnitPath, { unit: 'COUNTY_DURHAM_AND_DARLINGTON' })

    const response = await request(app)
      .post(pagePath)
      .type('form')
      .send({ action: 'back', unit: 'COUNTY_DURHAM_AND_DARLINGTON' })

    expect(response.headers.location).toBe(`/order/${orderId}/summary`)
  })

  it('shows the user an error when no unit is selected and the API rejects the request', async () => {
    stubOrderForRegion(api, 'NORTH_EAST')
    const expectedMessage = "Select the Responsible Organisation's PDU"
    api.stubFailure('PUT', probationDeliveryUnitPath, 400, [{ field: 'unit', error: expectedMessage }])

    const browser = request.agent(app)

    const submission = await browser.post(pagePath).type('form').send({ action: 'continue' })

    expect(submission.status).toBe(302)
    expect(submission.headers.location).toBe(pagePath)

    const redisplayed = await browser.get(pagePath)
    const $ = cheerio.load(redisplayed.text)

    expect($('.govuk-error-summary').text()).toContain(expectedMessage)
    expect($('.govuk-error-message').text()).toContain(expectedMessage)
  })
})
