import { v4 as uuidv4 } from 'uuid'
import ServiceRequestTypePage from './serviceRequestTypePage'
import Page from '../../../../pages/page'

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

    page.form.fillInWith('I need monitoring equipment installed at a new address')
    page.form.continueButton.click()
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/amend-order`,
      body: {
        type: 'REINSTALL_AT_DIFFERENT_ADDRESS',
      },
    }).should('be.true')
  })

  it('Should call amend endpoint with service request type of REINSTALL_DEVICE', () => {
    const page = Page.visit(ServiceRequestTypePage, { orderId: mockOrderId })

    page.form.fillInWith('I need monitoring equipment reinstalled or checked')
    page.form.continueButton.click()
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/amend-order`,
      body: {
        type: 'REINSTALL_DEVICE',
      },
    }).should('be.true')
  })

  it('Should call amend endpoint with service request type of REVOCATION', () => {
    const page = Page.visit(ServiceRequestTypePage, { orderId: mockOrderId })

    page.form.fillInWith('I need to end all monitoring for the device wearer')
    page.form.continueButton.click()
    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}/amend-order`,
      body: {
        type: 'REVOCATION',
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
})
