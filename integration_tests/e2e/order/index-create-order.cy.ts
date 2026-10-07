import { v4 as uuidv4 } from 'uuid'
import IndexPage from '../../pages/index'
import Page from '../../pages/page'
import NotifyingOrganisationPage from './interested-parties/notifying-organisation/notifyingOrganisationPage'

const mockOrderId = uuidv4()

context('Index', () => {
  context('Submitting a create order request', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.task('stubCemoListOrders')
      cy.task('stubCemoCreateOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS', type: 'REQUEST' })
      cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
      cy.signIn()
    })

    it('should create a new order and go to your details page', () => {
      // Visit the home page
      const page = Page.visit(IndexPage)

      // Create a new order
      page.newOrderFormButton.click()

      // Verify the api was called correctly
      cy.task('stubCemoVerifyRequestReceived', {
        uri: `/orders`,
        method: 'POST',
        body: {
          type: 'REQUEST',
        },
      }).should('be.true')

      Page.verifyOnPage(NotifyingOrganisationPage)
    })
  })
})
