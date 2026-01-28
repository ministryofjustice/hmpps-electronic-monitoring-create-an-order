import { v4 as uuidv4 } from 'uuid'
import Page from '../../../../pages/page'
import MappaPage from './MappaPage'
import InstallationAndRiskCheckYourAnswersPage from '../../../../pages/order/installation-and-risk/check-your-answers'

const mockOrderId = uuidv4()
const apiPath = '/mappa'

context('mappa page', () => {
  beforeEach(() => {
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

    cy.task('stubCemoGetOrder', {
      httpStatus: 200,
      id: mockOrderId,
      status: 'IN_PROGRESS',
    })

    cy.task('stubCemoSubmitOrder', {
      httpStatus: 200,
      id: mockOrderId,
      subPath: apiPath,
      response: {
        level: 'MAPPA_ONE',
        category: 'CATEGORY_ONE',
      },
    })

    cy.signIn()
  })

  it('can submit an order', () => {
    const page = Page.visit(MappaPage, { orderId: mockOrderId })

    page.form.fillInWith({ level: 'MAPPA 1', category: 'Category 1' })

    page.form.saveAndContinueButton.click()

    cy.task('stubCemoVerifyRequestReceived', {
      uri: `/orders/${mockOrderId}${apiPath}`,
      body: {
        level: 'MAPPA_ONE',
        category: 'CATEGORY_ONE',
      },
    }).should('be.true')

    Page.verifyOnPage(InstallationAndRiskCheckYourAnswersPage, 'Check your answers')
  })
})
