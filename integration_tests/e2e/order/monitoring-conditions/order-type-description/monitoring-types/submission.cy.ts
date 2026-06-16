import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../../pages/page'
import OrderTypePage from '../order-type/OrderTypePage'
import SentenceTypePage from '../sentence-type/SentenceTypePage'
import InstallationLocationPage from '../../../../../pages/order/monitoring-conditions/installation-location'
import PrarrPage from '../prarr/PrarrPage'
import AlcoholMonitoringPage from '../../../../../pages/order/monitoring-conditions/alcohol-monitoring'
import MonitoringTypePage from '../monitoring-type/MonitoringTypesPage'
import TypesOfMonitoringNeededPage from '../types-of-monitoring-needed/TypesOfMonitoringNeededPage'

const currentDate = new Date()
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
  endDate: `${currentDate.getFullYear() + 1}-10-11T11:00:00.000Z`,
  sentenceType: 'COMMUNITY_SDO',
  issp: 'YES',
  hdc: 'NO',
  prarr: 'UNKNOWN',
  pilot: 'GPS_ACQUISITIVE_CRIME_PAROLE',
  offenceType: '',
}
const apiPath = '/monitoring-conditions'
const stubGetOrder = () => {
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
    Page.visit(OrderTypePage, { orderId: mockOrderId })
    // commented out due to ELM-4526
    // orderTypePage.form.fillInWith('Release from prison')
    // orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Life Sentence')
    sentenceTypePage.form.continueButton.click()

    const prarrPage = Page.verifyOnPage(PrarrPage, { orderId: mockOrderId })
    prarrPage.form.fillInWith('No')
    prarrPage.form.continueButton.click()

    const monitoringTypePage = Page.verifyOnPage(MonitoringTypePage, { orderId: mockOrderId })
    monitoringTypePage.form.fillInWith('Alcohol')
    monitoringTypePage.form.continueButton.click()

    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: '/monitoring-conditions-alcohol',
      response: {
        monitoringType: 'ALCOHOL_ABSTINENCE',
        startDate: '2024-03-27T00:00:00.000Z',
        endDate: '2025-04-28T00:00:00.000Z',
      },
    })

    const alcoholMonitoringPage = Page.verifyOnPage(AlcoholMonitoringPage, { orderId: mockOrderId })
    alcoholMonitoringPage.fillInForm()
    alcoholMonitoringPage.form.saveAndContinueButton.click()

    const typesOfMonitoringNeededPage = Page.verifyOnPage(TypesOfMonitoringNeededPage, { orderId: mockOrderId })
    typesOfMonitoringNeededPage.form.fillInWith('No')
    typesOfMonitoringNeededPage.form.saveAndContinueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/monitoring-conditions`,
      body: {
        orderType: 'POST_RELEASE',
        conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
        sentenceType: 'LIFE_SENTENCE',
        curfew: false,
        exclusionZone: false,
        trail: false,
        mandatoryAttendance: false,
        alcohol: true,
        startDate: null,
        endDate: null,
        prarr: 'NO',
      },
    }).should('be.true')

    Page.verifyOnPage(InstallationLocationPage)
  })
})
