import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import IsMappaPage from './IsMappaPage'
import InstallationAndRiskCheckYourAnswersPage from '../../../../pages/order/installation-and-risk/check-your-answers'
import MappaPage from '../mappa/MappaPage'

const mockOrderId = uuidv4()
const apiPath = '/is-mappa'
const testFlags = { OFFENCE_FLOW_ENABLED: true }

context('is mappa page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('setFeatureFlags', testFlags)

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
      order: {
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
      },
    })

    cy.signIn()
  })

  it('is mappa', () => {
    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: apiPath,
      response: {
        isMappa: 'YES',
      },
    })

    const page = Page.visit(IsMappaPage, { orderId: mockOrderId })

    page.form.fillInWith({ isMappa: 'Yes' })

    page.form.saveAndContinueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${apiPath}`,
      body: {
        isMappa: 'YES',
      },
    }).should('be.true')

    Page.verifyOnPage(MappaPage, 'Check your answers')
  })

  it('is not mappa', () => {
    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: apiPath,
      response: {
        isMappa: 'NO',
      },
    })

    const page = Page.visit(IsMappaPage, { orderId: mockOrderId })

    page.form.fillInWith({ isMappa: 'No' })

    page.form.saveAndContinueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${apiPath}`,
      body: {
        isMappa: 'NO',
      },
    }).should('be.true')

    Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answers')
  })
})
