import { v4 as uuidv4 } from 'uuid'
import ServiceRequestTypePage from './serviceRequestTypePage'
import Page from '../../../../pages/page'
import NoRefitsPage from './no-refits/noRefitsPage'
import NoChangeResponsibleOfficerPage from './change-responsible-officer/noChangeResponsibleOfficerPage'

const mockOrderId = uuidv4()
const amendPath = '/amend-order'
context('order type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
    })

    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      method: 'POST',
      id: mockOrderId,
      subPath: amendPath,
      response: [{}],
    })
    cy.signIn()
  })

  it('Should call amend endpoint with service request type of REINSTALL_AT_DIFFERENT_ADDRESS', () => {
    const page = Page.visit(ServiceRequestTypePage, { orderId: mockOrderId })

    page.form.fillInWith('The device wearer needs to remain at a second or third address during curfew hours.')
    page.form.continueButton.click()
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/amend-order`,
      body: {
        type: 'REINSTALL_AT_DIFFERENT_ADDRESS',
      },
    }).should('be.true')
  })

  it('Should call amend endpoint with service request type of REVOCATION', () => {
    const page = Page.visit(ServiceRequestTypePage, { orderId: mockOrderId })

    page.form.fillInWith('The device wearer has been recalled to prison.')
    page.form.continueButton.click()
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/amend-order`,
      body: {
        type: 'REVOCATION',
      },
    }).should('be.true')
  })

  it('Should call amend endpoint with service request type of END_MONITORING', () => {
    const page = Page.visit(ServiceRequestTypePage, { orderId: mockOrderId })

    page.form.fillInWith("The device wearer's circumstances have changed and all monitoring needs to end.")
    page.form.continueButton.click()
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/amend-order`,
      body: {
        type: 'END_MONITORING',
      },
    }).should('be.true')
  })

  it('Should call amend endpoint with service request type of MAKING_A_CHANGE', () => {
    const page = Page.visit(ServiceRequestTypePage, { orderId: mockOrderId })

    page.form.fillInWith('I need to change something else in the form')
    page.form.continueButton.click()
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/amend-order`,
      body: {
        type: 'VARIATION',
      },
    }).should('be.true')
  })

  it('Should go to no refits page with service request type of NEEDS_CHECKING_OR_REFITTED', () => {
    const page = Page.visit(ServiceRequestTypePage, { orderId: mockOrderId })

    page.form.fillInWith('There is an issue with the equipment and it needs checking or refitted')
    page.form.continueButton.click()
    Page.verifyOnPage(NoRefitsPage)
  })

  it('Should go to no change responsible officer page with service request type of RESPONSIBLE_OFFICER_CHANGED', () => {
    const page = Page.visit(ServiceRequestTypePage, { orderId: mockOrderId })

    page.form.fillInWith('The Responsible Officer has changed')
    page.form.continueButton.click()
    Page.verifyOnPage(NoChangeResponsibleOfficerPage)
  })
})
