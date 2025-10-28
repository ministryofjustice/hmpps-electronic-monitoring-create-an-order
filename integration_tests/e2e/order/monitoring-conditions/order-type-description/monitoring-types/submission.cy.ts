import { v4 as uuidv4 } from 'uuid'
import MonitoringTypesPage from './MonitoringTypesPage'
import Page from '../../../../../pages/page'
import OrderTypePage from '../order-type/OrderTypePage'
import SentenceTypePage from '../sentence-type/SentenceTypePage'
import MonitoringDatesPage from '../monitoring-dates/MonitoringDatesPage'
import InstallationLocationPage from '../../../../../pages/order/monitoring-conditions/installation-location'

const mockResponse = {
  orderType: 'POST_RELEASE',
  orderTypeDescription: 'DAPOL',
  conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
  curfew: false,
  exclusionZone: false,
  trail: false,
  mandatoryAttendance: false,
  alcohol: true,
  startDate: '2024-10-10T11:00:00.000Z',
  endDate: '2024-10-11T11:00:00.000Z',
  sentenceType: 'COMMUNITY_SDO',
  issp: 'YES',
  hdc: 'NO',
  prarr: 'UNKNOWN',
  pilot: 'GPS_ACQUISITIVE_CRIME_PAROLE',
}
const apiPath = '/monitoring-conditions'
const stubGetOrder = () => {
  // cy.task('stubCemoGetOrder', {
  //   httpStatus: 200,
  //   id: mockOrderId,
  // })
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    order: {
      interestedParties: {
        notifyingOrganisation: 'PROBATION',
        notifyingOrganisationName: '',
        notifyingOrganisationEmail: '',
        responsibleOfficerName: '',
        responsibleOfficerPhoneNumber: '',
        responsibleOrganisation: 'HOME_OFFICE',
        responsibleOrganisationRegion: '',
        responsibleOrganisationEmail: '',
      },
    },
  })
}

const mockOrderId = uuidv4()
context('pilot', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    stubGetOrder()

    cy.task('stubCemoSubmitOrder', { httpStatus: 200, id: mockOrderId, subPath: apiPath, response: mockResponse })
    cy.signIn()
  })

  it('Should submit the form', () => {
    // go through the flow
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.fillInWith('Community')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Supervision Default Order')
    sentenceTypePage.form.continueButton.click()

    const monitoringDatesPage = Page.verifyOnPage(MonitoringDatesPage, { orderId: mockOrderId })
    monitoringDatesPage.form.fillInWithInput({
      startDate: new Date('2024-02-27T00:00:00Z'),
      endDate: new Date('2025-03-08T23:59:00Z'),
    })
    monitoringDatesPage.form.continueButton.click()

    const monitoringTypesPage = Page.verifyOnPage(MonitoringTypesPage, { order: mockOrderId })
    monitoringTypesPage.form.fillInWith('Alcohol')
    monitoringTypesPage.form.continueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/monitoring-conditions`,
      body: {
        orderType: 'COMMUNITY',
        conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
        sentenceType: 'COMMUNITY_SDO',
        curfew: false,
        exclusionZone: false,
        trail: false,
        mandatoryAttendance: false,
        alcohol: true,
        startDate: '2024-02-27T00:00:00.000Z',
        endDate: '2025-03-08T23:59:00.000Z',
      },
    }).should('be.true')

    Page.verifyOnPage(InstallationLocationPage)
  })
})
