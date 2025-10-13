import { v4 as uuidv4 } from 'uuid'
import CheckYourAnswersPage from './CheckYourAnswersPage'
import Page from '../../../../../pages/page'
import OrderTypePage from '../order-type/OrderTypePage'
import OrderTasksPage from '../../../../../pages/order/summary'
import SentenceTypePage from '../sentence-type/SentenceTypePage'

const mockOrderId = uuidv4()

const apiPath = '/monitoring-conditions'

const mockResponse = {
  orderType: 'POST_RELEASE',
  orderTypeDescription: 'DAPOL',
  conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
  curfew: true,
  exclusionZone: true,
  trail: true,
  mandatoryAttendance: true,
  alcohol: true,
  startDate: '2024-10-10T11:00:00.000Z',
  endDate: '2024-10-11T11:00:00.000Z',
  sentenceType: 'EPP',
  issp: 'YES',
  hdc: 'NO',
  prarr: 'UNKNOWN',
  pilot: 'GPS_ACQUISITIVE_CRIME_PAROLE',
}

context('Check your answers', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
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
    cy.task('stubCemoSubmitOrder', { httpStatus: 200, id: mockOrderId, subPath: apiPath, response: mockResponse })
    cy.signIn()

    // go through the flow
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.fillInWith('Community')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Supervision Default Order')
    sentenceTypePage.form.continueButton.click()
  })

  const pageHeading = 'Check your answers'

  it('should submit the monitoring conditions', () => {
    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

    page.continueButton().click()

    Page.verifyOnPage(OrderTasksPage)

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/monitoring-conditions`,
      body: {
        orderType: 'COMMUNITY',
        conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
        sentenceType: 'Community SDO',
        // some default values until other pages are filled in
        startDate: '2020-11-07T10:00:00.000Z',
        endDate: '2040-11-08T10:00:00.000Z',
        curfew: true,
      },
    }).should('be.true')
  })
})
